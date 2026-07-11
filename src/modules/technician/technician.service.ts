
import { Prisma, Role, UserStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { IBookingUpdate, ISetAvailability, Query } from "./technician.interface";



//& GET ALL TECHNICIAN
const getTechnicianFromDB = async (query: Query) => {

  const sort = query.sortBy ? query.sortBy : 'createdAt';
  const order = query.sortOrder ? query.sortOrder : 'desc';
  const page = Number(query.page || 1)
  const limit = Number(query.limit || 10)

  const andConditions: Prisma.UserWhereInput[] = []


  //! filtering

  andConditions.push({
    status: UserStatus.ACTIVE
  })

  andConditions.push({
    role: Role.TECHNICIAN
  })

  if (query.skills) {
    const skills = query.skills as string
    const arrSkills = skills.split(',').map((item) => item.trim())

    andConditions.push({
      technicianProfile: {
        skills: {
          hasSome: arrSkills
        }
      }
    })
  }

  if (query.minExperience || query.maxExperience) {
    andConditions.push({
      technicianProfile: {
        experience: {
          ...(query.minExperience && { gte: Number(query.minExperience) }),
          ...(query.maxExperience && { lte: Number(query.maxExperience) }),
        },
      }
    });
  }

  const users = await prisma.user.findMany({
    where: {
      AND: andConditions,
    },

    take: limit,
    skip: (page - 1) * limit,

    orderBy: {
      [sort as string]: order as Prisma.SortOrder
    },
    omit: {
      password: true,
      createdAt: true,
      updatedAt: true,
    },
    include: {
      technicianProfile: {
        omit: {
          id: true,
          userId: true,
          createdAt: true,
          updatedAt: true
        }
      }
    },
  });

  const total = await prisma.user.count({
    where: {
      AND: andConditions
    }
  })

  const meta = {
    total,
    page,
    limit,
    totalPage: Math.ceil(total / limit)
  }

  return {
    meta,
    users
  }
};


//& GET TECHNICIAN BY ID
const getTechnicianByIdFromDB = async (id: string) => {

  const technician = await prisma.user.findUnique({
    where: { id },
    omit: {
      password: true
    },
    include: {
      technicianProfile: {
        omit: {
          id: true,
          userId: true,
          createdAt: true,
          updatedAt: true
        },
        include: {
          reviews: {
            omit: {
              serviceId: true,
              customerId: true,
              technicianId: true,

            }
          }
        }
      }
    }
  })
  return technician
};


//& get booking
const getBookingFromDB = async (userId: string) => {

  const techProfile = await prisma.technicianProfile.findUniqueOrThrow({
    where: { userId }
  })

  const technicianId = techProfile?.id

  const bookings = await prisma.booking.findMany({
    where: { technicianId },
    include: {
      service: true
    },
  })

  return bookings

}


//& update booking STATUS
const updateBookingStatusFromDB = async (id: string, payload: IBookingUpdate) => {

  const booking = await prisma.booking.findUnique({
    where: { id },
  });

  if (!booking) {
    return null;
  }

  let updateData = {};

  if (
    (booking.status === "REQUESTED" || booking.status === "DECLINED") && payload.status === "ACCEPTED") {
    updateData = {
      status: "ACCEPTED",
      acceptedAt: new Date(),
      canceledAt: null,
      cancelReason: null,
    };
  }

  else if (
    booking.status === "REQUESTED" && payload.status === "DECLINED") {
    updateData = {
      status: "DECLINED",
      canceledAt: new Date(),
      cancelReason: payload.cancelReason,
    };
  }

  else if (booking.status === "IN_PROGRESS" && payload.status === "COMPLETED") {
    updateData = {
      status: "COMPLETED",
      completedAt: new Date(),
    };
  }

  else {
    throw new Error(
      `Invalid status transition: ${booking.status} -> ${payload.status}`
    );
  }

  const transectionResult = await prisma.$transaction(
    async (tx) => {
    const bookingUpdated = await tx.booking.update({
      where: { id },
      data: updateData,
    });

    if (payload.status === "COMPLETED") {
      await tx.technicianProfile.update({
        where: {
          id: booking.technicianId,
        },
        data: {
          completedJobs: {
            increment: 1,
          },
        },
      });
    }

    return bookingUpdated;
  });

  return transectionResult;
};



//* view incoming booking
const incommigBooking = async (id: string) => {

  const booking = await prisma.booking.findMany({
    where: {
      technicianId: id,
      status: "REQUESTED"
    },
    include: {
      service: true,
      technician: {
        include: {
          user: true
        }
      }
    }
  })

  return booking.map((book) => ({
    bookingId: book.id,
    customerName: `${book.technician.user.firstName} ${book.technician.user.lastName ?? ""}`.trim(),
    serviceName: book.service.title,
    scheduledDate: book.scheduledDate,
    address: book.address,
    note: book.note,
    totalAmount: Number(book.totalAmount),
    status: book.status,
    createdAt: book.createdAt,
  }));
}



//& update availability 
const setAvailabilityIntoDB = async (id: string, payload: ISetAvailability) => {

  const { availability } = payload

  const updated = await prisma.technicianProfile.update({
    where: {
      userId: id
    },
    data: {
      availability
    }
  })

  return updated
}


export const technicianService = {
  getTechnicianFromDB,
  getTechnicianByIdFromDB,
  getBookingFromDB,
  updateBookingStatusFromDB,
  incommigBooking,
  setAvailabilityIntoDB
}