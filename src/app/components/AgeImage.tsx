import Image from "next/image";

const AgeAll = () => {
  return <Image className='age' src='/images/age/age-all.png' alt='all' width={0} height={0} unoptimized />
}

const Age12 = () => {
  return <Image className='age' src='/images/age/age-12.png' alt='12' width={0} height={0} unoptimized />
}

const Age15 = () => {
  return <Image className='age' src='/images/age/age-15.png' alt='15' width={0} height={0} unoptimized />
}

const Age19 = () => {
  return <Image className='age' src='/images/age/age-19.png' alt='19' width={0} height={0} unoptimized />
}

export {AgeAll, Age12, Age15, Age19};