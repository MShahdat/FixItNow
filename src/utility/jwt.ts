import jwt, { JwtPayload, type SignOptions } from 'jsonwebtoken'

const createToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: SignOptions['expiresIn'],
) => {
  const token = jwt.sign(payload, secret, { expiresIn })
  return token
}


const jwtVerify = (token: string, secret: string) => {
  const tokenVerify = jwt.verify(token, secret)

  if (typeof tokenVerify === 'string') {
    return false
  } 
  
  return tokenVerify
}


export const jwtToken = {
  createToken,
  jwtVerify,
}