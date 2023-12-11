import React from 'react'

const LT = () => {
  return (
    <div className='content py-40 '>
      <div className='lg:w-[1200px] mx-auto px-2'>
        <h2 className='font-bold text-[20px] mb-4 md:text-[40px]'>Lộ trình học</h2>
        <p className='mb-10 '>
          Để bắt đầu một cách thuận lợi, bạn nên tập trung vào một lộ trình học.
          Ví dụ: Để đi làm với vị trí "Lập trình viên Front-end" bạn nên tập trung
          vào lộ trình "Front-end".
        </p>
        <div>
          <div >
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              <div className='border-2 p-5  rounded-xl h-[200px]'>
                <h3 className='font-bold text-[20px] '>Lộ trình học Front-end</h3>
                <div className='flex justify-center space-x-10 '>
                  <p className='text-[14px] md:text-[16px]'>Lập trình viên Front-end là người xây dựng ra giao diện websites.
                    Trong phần này F8 sẽ chia sẻ cho bạn lộ trình để trở thành lập trình viên Front-end nhé.</p>
                  <img className='w-[100px] h-[100px] border-4 border-[#e74c3c] rounded-full hidden md:block' src="../../../public/img/fe.jpg" alt="" />
                </div>
                <div className=' mt-4 md:mt-0'>
                  <a className='bg-[#e74c3c] text-white px-28 md:px-4 py-2 rounded-2xl font-bold' href="/lotrinh/FE">Xem chi tiết</a>
                </div>
              </div>
              <div className='border-2 p-5 rounded-xl h-[200px]'>
                <h3 className='font-bold text-[20px] '>Lộ trình học Back-end</h3>
                <div className='flex justify-center space-x-10 '>
                  <p className='text-[14px] md:text-[16px]'>Lập trình viên Back-end là người xây dựng ra giao diện websites.
                    Trong phần này F8 sẽ chia sẻ cho bạn lộ trình để trở thành lập trình viên Front-end nhé.</p>
                  <img className='w-[100px] h-[100px] border-4 border-[#e74c3c] rounded-full hidden md:block' src="../../../public/img/be.jpg" alt="" />
                </div>
                <div className=' mt-4 md:mt-0'>
                  <a className='bg-[#e74c3c] text-white px-28 md:px-4 py-2 rounded-2xl font-bold' href="/lotrinh/BE">Xem chi tiết</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LT