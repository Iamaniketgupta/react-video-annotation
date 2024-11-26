import { useEffect, useState } from "react"

export default function DataForm({ annotationData }) {
    const [data, setData] = useState(annotationData);

    useEffect(() => {
        setData(annotationData);
    }, [annotationData])

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(data);
    }

    return (
        <div className='bg-stone-700 p-2 rounded-md shadow-lg'>


            <div className='flex items-center justify-between gap-4 p-1'>

                <input type="text" name="" id="" value={data?.label || ""}
                    onChange={(e) => setData((prev) => ({ ...prev, label: e.target.value }))}

                    placeholder="Label"
                    className=' outline-none border-b bg-transparent text-white' />
                <div
                title={data?.color ? data.color : "No Color"}
                    style={{
                        backgroundColor: data?.color ? data.color : "black"
                    }}
                    className={`w-5 h-5`}></div>
            </div>

            <form onSubmit={handleSubmit}>
                <input type="text" name="" id=""
                    placeholder='Annotation Name'
                    onChange={(e) => setData((prev) => ({ ...prev, data: { ...prev.data, annotationName: e.target.value } }))}
                    value={data?.data?.annotationName || ""}  // custom data insertion in the data object
                    className=' w-full outline-none border-stone-800 my-2 px-3   bg-transparent text-white' />
                <input type="text" name="" id=""
                    placeholder='Issue'
                    value={data?.data?.issue || ""}  // custom data insertion in the data object
                    onChange={(e) => setData((prev) => ({ ...prev, data: { ...prev.data, issue: e.target.value } }))}

                    className='w-full  outline-none border-stone-800 my-2 px-3   bg-transparent text-white' />
                <input type="text" name="" id=""
                    placeholder='Description'
                    onChange={(e) => setData((prev) => ({ ...prev, data: { ...prev.data, description: e.target.value } }))}

                    value={data?.data?.description || ""}  // custom data insertion in the data object
                    className='w-full  outline-none border-stone-800 my-2 px-3   bg-transparent text-white' />

                <button className='bg-blue-600 text-white px-3 py-1 rounded-md mt-3 w-full hover:bg-blue-700'>Save</button>
            </form>


        </div>
    )
}
