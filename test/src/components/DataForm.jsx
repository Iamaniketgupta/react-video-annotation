
export default function DataForm() {
    return (
        <div className='bg-stone-700 p-2 rounded-md shadow-lg'>


            <div className='flex items-center justify-between gap-4 p-1'>

                <input type="text" name="" id="" value={"Label"}
                    className=' outline-none border-b bg-transparent text-white' />
                <div className='w-5 h-5 bg-yellow-500'></div>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
                <input type="text" name="" id=""
                    placeholder='Annotation Name'
                    className=' w-full outline-none border-stone-800 my-2 px-3   bg-transparent text-white' />
                <input type="text" name="" id=""
                    placeholder='Issue'
                    className='w-full  outline-none border-stone-800 my-2 px-3   bg-transparent text-white' />
                <input type="text" name="" id=""
                    placeholder='Description'
                    className='w-full  outline-none border-stone-800 my-2 px-3   bg-transparent text-white' />

                <button className='bg-blue-600 text-white px-3 py-1 rounded-md mt-3 w-full hover:bg-blue-700'>Save</button>
            </form>


        </div>
    )
}
