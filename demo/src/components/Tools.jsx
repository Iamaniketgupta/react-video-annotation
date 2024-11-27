import { FaUndo, FaRedo, FaTrash, FaGithub } from "react-icons/fa";
export default function Tools({ annotationRef }) {


    return (
        <>
            {/* Branding */}
            <div className="text-white font-bold text-lg">
                <span>Video</span>
                <span className="ml-2">Annotator Demo</span>
            </div>

            {/* Toolbar Buttons */}
            <div className="flex items-center gap-4">
                {/* Undo Button */}
                <button
                    onClick={annotationRef.current?.undo}
                    title="Undo or CTRL+Z"
                    className="text-white bg-stone-700 hover:bg-stone-600 p-2 rounded-full transition">
                    <FaUndo size={18} />
                </button>
                {/* Redo Button */}
                <button
                    onClick={annotationRef.current?.redo}
                    title="Redo or CTRL+Y"
                    className="text-white bg-stone-700 hover:bg-stone-600 p-2 rounded-full transition">
                    <FaRedo size={18} />
                </button>
                {/* Delete Button */}
                <button
                    onClick={annotationRef.current?.deleteShape}
                    title="Delete or delete key"
                    className="text-white bg-red-700 hover:bg-red-600 p-2 rounded-full transition">
                    <FaTrash size={18} />
                </button>

                {/* GitHub Link */}
                <a
                    href="https://github.com/iamaniketgupta/react-video-annotation-tool"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-white bg-stone-700 hover:bg-stone-600 px-4 py-2 rounded-full transition"
                >
                    <FaGithub size={18} className="mr-2" />
                    GitHub
                </a>
            </div>
        </>
    )
}
