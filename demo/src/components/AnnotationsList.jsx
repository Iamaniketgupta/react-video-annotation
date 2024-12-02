import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function AnnotationsList({ allAnnotations }) {
  const [filterAnnotations, setFilterAnnotations] = useState(
    allAnnotations || []
  );
  useEffect(() => {
    setFilterAnnotations(allAnnotations);
  }, [allAnnotations]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    const filteredAnnotations = allAnnotations.filter((item) => {
      return item.label.toLowerCase().includes(query);
    });
    setFilterAnnotations(filteredAnnotations);
  };

  return (
    <div className=" p-2 mt-2 rounded-md flex flex-col overflow-auto">
      <div className="flex gap-2 items-center px-2">
        <FaSearch className="text-stone-500" />
        <input
          onChange={handleSearch}
          type="text"
          name=""
          id=""
          placeholder="Search Annotation"
          className="px-2 py-1 rounded-md text-xs bg-transparent outline-none  text-white"
        />
      </div>
      <div
        className=" rounded-md p-2 bg-stone-700 mt-1 min-h-20 flex flex-col gap-2 overflow-y-auto"
        style={{ maxHeight: "200px", scrollbarWidth: "none" }}
      >
        {filterAnnotations.length > 0 ? (
          filterAnnotations?.map((item) => (
            <div
              key={item?.id}
              title={item?.label}
              className="flex text-xs mt-1 items-center gap-4 p-1 hover:bg-stone-800  rounded cursor-pointer"
            >
              <div
                className={`${
                  item?.properties?.type === "rectangle"
                    ? `w-8 h-4 bg-[${item?.color}]`
                    : ""
                } 
                    ${
                      item?.properties?.type === "circle"
                        ? `w-8 h-5 rounded-full bg-[${item?.color}]`
                        : ""
                    } 
                    ${
                      item?.properties?.type === "line"
                        ? `w-8 h-0 bg-[${item?.color}]`
                        : ""
                    } border-2 border-[${item?.color}]`}
                    style={{backgroundColor: item?.color , borderColor:`${item?.properties?.type==='line' ? item?.color : ''}`}}
              ></div>
              <div
                className={`w-2 h-2 rounded-full flex bg-[${item?.color}] items-center gap-2`}
              />
              <p className="font-semibold text-white cols-span-5 flex-grow w-full">
                {item?.label || "No Label"}
              </p>
              <p className=" text-white min-w-fit px-2">
                {item?.properties?.endTime}
              </p>
              <p className=" text-white min-w-fit px-2">
                {item?.properties?.endTime}
              </p>
            </div>
          ))
        ) : (
          <p className="text-white text-xs text-center">No Annotations Found</p>
        )}
      </div>
    </div>
  );
}
