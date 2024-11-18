import { FaSearch } from "react-icons/fa";

export default function AnnotationsList() {
    const demoData = [1, 3, 21, 2, 31, 12, 3, 1];
    return (
        <div className=" p-2 mt-2 rounded-md flex flex-col overflow-auto">
            <div className="flex gap-2 items-center px-2">
                <FaSearch className="text-stone-500" />
                <input type="text" name="" id="" placeholder="Search Annotation"
                    className="px-2 py-1 rounded-md text-xs bg-transparent outline-none  text-white" />
            </div>
            <div
                className=" rounded-md p-2 bg-stone-700 mt-1 flex flex-col gap-2 overflow-y-auto"
                style={{ maxHeight: "200px", scrollbarWidth: "none" }} // Adjust the height as needed
            >
                {
                    demoData?.map((item) => (
                        <div key={item.id} className="flex text-xs mt-1 items-center gap-4 p-1 hover:bg-stone-800 px-2 rounded cursor-pointer">
                            <div className="w-2 h-2 rounded-full flex bg-blue-700 items-center gap-2" />
                            <p className="font-semibold text-white cols-span-5 flex-grow w-full">Lable {item}</p>
                            <p className=" text-white min-w-fit px-2">At 7:42</p>

                        </div>
                    ))
                }
            </div>
        </div>
    )
}
