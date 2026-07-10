
import { Prisma, Role, UserStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ICategoryCreate, ICategoryUpdate, IUserStatus, Query } from "./admin.interface";


//& GET ALL USERS
const getAllUsersFromDB = async (query: Query) => {

  const sort = query.sortBy ? query.sortBy : 'createdAt';
  const order = query.sortOrder ? query.sortOrder : 'desc';
  const page = Number(query.page || 1)
  const limit = Number(query.limit || 10)

  const andConditions: Prisma.UserWhereInput[] = []


  //! searching
  if (query.search) {
    andConditions.push({
      OR: [
        {
          firstName: {
            contains: query.search as string,
            mode: "insensitive"
          }
        },
        {
          lastName: {
            contains: query.search as string,
            mode: 'insensitive'
          }
        },
        {
          phone: {
            contains: query.search as string,
            mode: "insensitive"
          }
        },
        {
          address: {
            contains: query.search as string,
            mode: "insensitive"
          }
        },
        {
          city: {
            contains: query.search as string,
            mode: "insensitive"
          }
        }
      ]
    })
  }

  //! filtering
  if (query.skill) {
    const arrSkill = Array.isArray(query.skill)
      ? query.skill
      : (query.skill as string).split(',').map((item) => item.trim())

    andConditions.push({
      technicianProfile: {
        skills: {
          hasSome: arrSkill
        }
      }
    })
  }

  if (query.verify) {
    andConditions.push({
      technicianProfile: {
        isVerified: Boolean(query.verify)
      }
    })
  }

  if (query.role) {
    andConditions.push({
      role: (query.role as string).toUpperCase() as Role,
    });
  } else {
    andConditions.push({
      role: {
        in: [Role.CUSTOMER, Role.TECHNICIAN],
      },
    });
  }

  if (query.status) {
    andConditions.push({
      status: query.status as UserStatus
    })
  }
  if (query.minExperience || query.maxExperience) {
    andConditions.push({
      technicianProfile: {
        experience: {
          ...(query.minExperience && { gte: Number(query.minExperience) }),
          ...(query.maxExperience && { lte: Number(query.maxExperience) }),
        }
      }
    })
  }


  const users = await prisma.user.findMany({
    where: {
      AND: andConditions,
    },

    take: limit,
    skip: (page - 1) * limit,

    orderBy: {
      [sort]: order
    },
    select: {
      id: true,
      role: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      profileImage: true,
      address: true,
      city: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      technicianProfile: {
        select: {
          id: true,
          bio: true,
          skills: true,
          experience: true,
          hourlyRate: true,
          completedJobs: true,
          isVerified: true,
        }
      },
    },
  });

  const total = await prisma.user.count({
    where: {
      AND: andConditions
    }
  })

  const formattedUsers = users.map((user) => {
    const base = {
      id: user.id,
      role: user.role,
      fullName: `${user.firstName} ${user.lastName ?? ''}`.trim(),
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      address: user.address,
      city: user.city,
      status: user.status,
    };
    if (user.role === Role.TECHNICIAN && user.technicianProfile) {
      return {
        ...base,
        profileId: user.technicianProfile.id,
        bio: user.technicianProfile.bio,
        skills: user.technicianProfile.skills,
        experience: user.technicianProfile.experience,
        hourlyRate: user.technicianProfile.hourlyRate,
        completedJobs: user.technicianProfile.completedJobs,
        isVerified: user.technicianProfile.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    }

    return base;
  })

  const meta = {
    total,
    page,
    limit,
    totalPage: Math.ceil(total / limit)
  }

  return {
    users: formattedUsers,
    meta
  }
};



//& update status 
const updateStatusIntoDB = async (userId: string, payload: IUserStatus) => {

  console.log('user status ', payload)

  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) {
    return 'not'
  }

  const updated = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      status: payload.status
    }
  })

  return updated
}



//& booking get
const getBookingFromDB = async () => {
  const bookings = await prisma.booking.findMany({
    select: {
      id: true,
      scheduledDate: true,
      status: true,
      totalAmount: true,
      service: {
        select: {
          title: true,
        },
      },
      technician: {
        select: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            }
          }
        }
      }
    }
  })

  return bookings.map((booking) => ({
    id: booking.id,
    serviceTitle: booking.service.title,
    technicianName: `${booking.technician.user.firstName} ${booking.technician.user.lastName ?? ""}`.trim(),
    scheduledDate: booking.scheduledDate,
    status: booking.status,
    totalAmount: Number(booking.totalAmount),
  }));
};



//& create category
const createCategoryIntoDB = async (payload: ICategoryCreate) => {
  const { name, description } = payload

  if (!name || !description) {
    return null
  }

  const cat = await prisma.category.findUnique({
    where: {
      name
    }
  })

  if (cat) {
    return 'exist'
  }

  const result = await prisma.category.create({
    data: {
      ...payload
    }
  })

  return result
}




//& UPDATE CATEGORIES
const updateCategoriesByIdFromDB = async (categoryId: string, payload: ICategoryUpdate) => {

  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  })
  if (!category) {
    return null
  }

  const updated = await prisma.category.update({
    where: { id: categoryId },
    data: {
      ...payload
    }
  })
  return updated
}



//& DELETE CATEGORIES BY ID
const deleteCategoriesByIdFromDB = async (categoryId: string) => {

  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  })
  if (!category) {
    return 'not'
  }

  await prisma.category.delete({
    where: { id: categoryId }
  })
}



//& payment history
const paymentHisotyFromDB = async () => {

  const history = await prisma.payment.findMany({

    select: {
      bookingId: true,
      amount: true,
      status: true,
      transactionId: true,
      paymentIntentId: true,
      paidAt: true,
      booking: {
        select: {
          service: {
            select: {
              title: true,
              type: true,
              technician: {
                select: {
                  user: {
                    select: {
                      firstName: true,
                      lastName: true,
                    },
                  },
                },
              }
            }
          },
        }
      },
      user: {
        select: {
          firstName: true,
          lastName: true,
        }
      }
    }
  })

  return history.map((his) => ({
    bookingId: his.bookingId,
    customerName: `${his.user.firstName} ${his.user.lastName ?? ""}`.trim(),
    technicianName: `${his.booking.service.technician.user.firstName} ${his.booking.service.technician.user.lastName ?? ""}`.trim(),
    serviceTitle: his.booking.service.title,
    serviceType: his.booking.service.type,
    amount: Number(his.amount),
    status: his.status,
    transactionId: his.transactionId,
    paymentIntentId: his.paymentIntentId,
    paidAt: his.paidAt,
  }));
}




export const adminService = {
  getAllUsersFromDB,
  updateStatusIntoDB,
  getBookingFromDB,
  createCategoryIntoDB,
  updateCategoriesByIdFromDB,
  deleteCategoriesByIdFromDB,
  paymentHisotyFromDB,

}