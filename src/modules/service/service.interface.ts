

export interface IServicePayload {
  categoryId: string
  title: string
  description: string
  price: number
  location: string[]
  duration: string
  availableAt: string[]
}




export interface IServiceUpdate {
  title?: string
  description?: string
  type?: string,
  price?: number
  location?: string[]
  duration?: string
  availableAt?: string[]
}

