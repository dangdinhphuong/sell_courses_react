
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import { AiOutlineEdit } from "react-icons/ai";
import { useGetLessonByIdQuery } from "@/Api/lesson";
import { useRemoveQuizzMutation } from "@/Api/quizz";

export const Detaillesson = () => {
  const { idLesson } = useParams<{ idLesson: string }>();
  const { data: lessonData, isLoading } = useGetLessonByIdQuery(idLesson || "");

  const [removeQuizz] = useRemoveQuizzMutation();

  const confirm = (id: number) => {
    removeQuizz(id)
      .unwrap()
      .then((response: any) => {
        console.log("Xóa bài học thành công", response);
        window.location.reload();
      })
      .catch((error: any) => {
        console.error("Lỗi khi xóa bài học", error);
      });
  };
 

  if (isLoading) {
    return <div>Loading...</div>;
  } 

  if (!lessonData) {
    return <div>No data found for this product.</div>;
  }

  const quizzdata = lessonData?.data.quizzs || []; // Lấy dữ liệu quizz từ lessonData
  console.log(lessonData);
  console.log(quizzdata.name);
  
  
  return (
    <>
    <div className="flex">
    <button className=" bg-yellow-500 hover:bg-yellow-400 hover:text-white  text-white font-bold py-1 px-4 border border-yellow-500 rounded w-48 h-10 flex items-center mb-[-20px]">
       <Link to={`/admin/lesson/edit/${lessonData.data._id}`} className="hover:text-white">
       <span >sửa bài học</span>
       </Link>
     </button>
     <button className="bg-green-700 hover:bg-green-600 hover:text-white  text-white font-bold py-1 px-4 border border-green-600 rounded w-48 h-10 flex items-center ml-[38%]">
       <Link
         to={`/admin/quizz/add/${lessonData.data._id}`}
         className="flex items-center space-x-1  hover:text-white justify-center text-sm"
       >
         <FaPlus></FaPlus>
         <span>Thêm quizz</span>
       </Link>
     </button>
    </div>
     <div className="flex">
       <div className="w-1/2 p-4">
         <h1 className="text-xl font-semibold"><span className="font-medium text-2xl">Tên bài học : </span>{lessonData.data.name}</h1>
         
         <p className="mt-4"> <p className="font-medium text-2xl">video</p><video src={lessonData.data.video}className="w-[50%]"/></p>
    
       </div>
       {/* =============================================================  */}
       <div className="w-1/2 p-4">
        <h2 className="text-2xl font-semibold mb-4">Quizzs</h2>
        <ul>
          {quizzdata.map((quizz: any, index: any) => (
            <li key={index} className="border py-4 px-2 mb-4 hover:bg-gray-200 rounded-lg">
            <div className="flex flex-row items-center gap-4">
              <Link to={`/admin/lesson/detail/${quizz._id}`} className="text-lg">
              <span className="font-bold text-xl">Câu hỏi : </span> {quizz.name}
              </Link>
           
            </div>
            <div className=" flex-row items-center gap-4 ml-2  mt-4 ">
              <p className="text-sm"><span className="font-medium text-lg text-green-700">Đáp án 1: </span> {quizz.correctAnswer}</p>
              <p className="text-sm"><span className="font-medium text-lg">Đáp án 2: </span>  {quizz.Wronganswer1}</p>
              <p className="text-sm"><span className="font-medium text-lg">Đáp án 3: </span> {quizz.Wronganswer2}</p>
              <p className="text-sm"><span className="font-medium text-lg">Đáp án 4: </span>  {quizz.Wronganswer3}</p>
            </div>
            <div className="flex items-center space-x-3 ml-[45%] mt-10">
                <button
                  className="w-7 h-7 bg-red-700 text-white rounded-lg pl-1"
                  onClick={() => confirm(quizz._id)}
                >
                  <IoTrashOutline className="text-lg" />
                </button>
                <button className="w-7 h-7 bg-red-700 text-white rounded-lg pl-1">
                  <Link to={`/admin/quizz/edit/${quizz._id}`}>
                    <AiOutlineEdit className="text-lg" />
                  </Link>
                </button>
              </div>
          </li>
          
          
          ))}
        </ul>
      </div>
     </div>

   </>
  );
};

export default Detaillesson;
