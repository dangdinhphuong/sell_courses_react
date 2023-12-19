import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useGetLessonByIdQuery } from "@/Api/lesson";
import {
  useNavigate,
  useParams,
  Link,
  createSearchParams,
  useSearchParams,
} from "react-router-dom";
import isEqual from "lodash/isEqual";
import { Quiz } from "@/interface/quizzs";
import ReactQuill from "react-quill";
import Quill from "quill";
import "react-quill/dist/quill.snow.css";
import { AiOutlinePlus } from "react-icons/ai";
import { FaRegHandPointLeft } from "react-icons/fa";
import { FaRegStickyNote } from "react-icons/fa";
import { FiDelete } from "react-icons/fi";
import { AiFillEdit } from "react-icons/ai";
import { MdSlowMotionVideo } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Drawer,
  Input,
  List,
  Modal,
  Space,
  message,
  notification,
  Checkbox,
} from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { BsArrowRight } from "react-icons/bs";
import { useGetProductByIdQuery } from "@/Api/productApi";
import { RaceBy } from "@uiball/loaders";
import {
  useGetNotesQuery,
  useAddNoteMutation,
  useUpdateNoteMutation,
  useRemoveNoteMutation,
} from "@/Api/note";
import {
  useGetCourseprogressByIdQuery,
  useGetProgressByIdQuery,
} from "@/Api/CourseProgress";
import { useCreateCommentMutation } from "@/Api/comment";
import { useAddHistoryTestMutation, useGetHistoryTestQuery } from "@/Api/historyTest";

import axios from "axios";
import { useAddScoreMutation, useUpdateStatusMutation } from "@/Api/score";
type Answer = {
  quizId: any;
  selectedOption: any;
};
const Comment = React.memo(({ comment }: any) => {
  const vsv = comment.createdAt.split('T')[0];
  const [checkComment, setCheckComment] = useState(false);
  const [userInfo, setUserInfo] = useState(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    return storedUserInfo ? JSON.parse(storedUserInfo) : {};
  });
  const [queryParameters] = useSearchParams();

  const parentId = queryParameters.get("parentId");
  const navigate = useNavigate();
  const { idProduct } = useParams();
  const [createCommentI] = useCreateCommentMutation();
  const [commentReply, setComment] = useState("");
  const handleReplyComment = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:8088/api/create-comment', {
        name: commentReply,
        idUser: userInfo.userData._id,
        idCourse: idProduct,
        parentId: parentId,
        userAvatar: userInfo.userData.img,
      });

      message.success('Comment created successfully');

    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };
  useEffect(() => {
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  }, [userInfo]);
  return (
    <div className="comment">
      <div className="comment-content mb-4">
        <div className="flex grid-cols-1">
          <div className="avatar-container1">
            <img src={comment.user?.img ? comment.user?.img  : 'https://img.myloview.com/posters/default-avatar-profile-icon-vector-social-media-user-photo-700-205577532.jpg'} alt="" />
          </div>
          <div className="flex-col items-end">
            <div className="flex flex-col items-start flex1">
              <p className="font-bold text-xs">{comment.user?.name}</p>
              <p>{comment?.name}</p>
              <p>{ vsv}</p>
            </div>
            <div
              className="text-xs text-xs1 font-serif mt-1"
              onClick={() => {
                setCheckComment(!checkComment);
                navigate({
                  pathname: "",
                  search: createSearchParams({
                    parentId: comment._id,
                  }).toString(),
                });
              }}
            >
              <Link to={``}>Trả lời</Link>
            </div>
          </div>
          {/* <p>{comment?.updatedAt}</p> */}
        </div>
        {checkComment && (
          <form onSubmit={handleReplyComment}>
            <input
              value={commentReply}
              onChange={(event) => setComment(event.target.value)}
              className="mt-2 w-full h-10 outline-none pl-2 rounded-lg border-2 border-gray-300"
              placeholder="Viết bình luận của bạn..."
            />
            <Button htmlType="submit" className="mt-3"> Bình Luận </Button>
          </form>
        )}
      </div>
      {comment.children.length > 0 && (
        <div className="comment-children">
          {comment.children.map((child: any) => {
            // console.log(child, "children");
            return <Comment key={child._id} comment={child} />;
          })}
        </div>
      )}
    </div>
  );
});
function Videodetail() {
  const { idLesson } = useParams<{ idLesson: string }>();
  const { data: lessonData, refetch: refetchLessonData } = useGetLessonByIdQuery(idLesson || "");
  const [createCommentI] = useCreateCommentMutation();
  const [shuffledQuizzData, setShuffledQuizzData] = useState<Quiz[]>([]);
  const [demo, setDemo] = useState<any[]>([]);
  const [statusCmtt, setStatusCmtt] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showRetryButton, setShowRetryButton] = useState(false);
  const [comment, setComment] = useState("");
  const [countdown, setCountdown] = useState(10);
  const [selectedAnswers, setSelectedAnswers] = useState<Answer[]>([]);
  const [countdownInterval, setCountdownInterval] = useState<number | null>(
    null
  );
  const videoRef = useRef(null);
  const [prevTime, setPrevTime] = useState(0);

  const { idProduct } = useParams<{ idProduct: string }>();
  const { data: productData, isError } = useGetProductByIdQuery(
    idProduct || ""
  );
  useEffect(() => {
    const handelFetchCOmment = async () => {
      const { data } = await axios.get(
        `http://localhost:8088/api/get-src/${idProduct}`
      );
      setDemo(
        data?.data.comment2.filter((items: any) => items.status == "true")
      );
    };
    handelFetchCOmment();
  }, [statusCmtt]);
  useEffect(() => {
    if (isShowTest) setIsShowTest(false)
  }, [idLesson])
  const { idUser } = useParams<{ idUser: string }>();
  const { data: Courseprogress, refetch: refetchCourseProgress } = useGetCourseprogressByIdQuery({
    productId: idProduct,
    userId: idUser,
  });
  const { data: historyTestData, refetch: refetchhistoryTestData } = useGetHistoryTestQuery({
    lessonId: idLesson,
    userId: idUser,
  })

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const [noteContent, setNoteContent]: any = useState(""); // State for note content
  const [isEditingNote, setIsEditingNote]: any = useState(false); // State to check if editing note or not
  const [open, setOpen] = useState(false);
  const [openTestModal, setOpenTestModal] = useState(false);
  const [noteList, setNoteList]: any = useState([]);
  const [editingNoteIndex, setEditingNoteIndex] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [api, contextHolder] = notification.useNotification();
  const [isOpenModalHistory, setOpenModalHistory] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isShowTest, setIsShowTest] = useState(false)
  const idOfLesson0 = productData?.data?.lessons[0]?._id;
  // Khai báo mutation và query
  const [addNoteMutation] = useAddNoteMutation();
  const [updateNoteMutation] = useUpdateNoteMutation();
  const [removeNoteMutation] = useRemoveNoteMutation();
  const { data: notesData } = useGetNotesQuery();
  const [addScore] = useAddScoreMutation();
  const [addHistoryTest] = useAddHistoryTestMutation();

  const [updateStatus] = useUpdateStatusMutation();
  const videoSourceUrl = lessonData?.data.video || "";

  const dataHistory = useMemo(() => {
    if (historyTestData?.data) {
      return JSON.parse(historyTestData.data.content)
    }
  })
  // Hàm xáo trộn một mảng
  function shuffleArray(array: any) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  // Hàm xử lý khi người dùng chọn một câu trả lời
  const selectAnswer = (quiz: Quiz, selectedOption: any) => {
    const updatedAnswers = [...selectedAnswers];
    const answerIndex = updatedAnswers.findIndex(
      (answer: Answer) => answer.quizId === quiz._id
    );

    if (answerIndex !== -1) {
      updatedAnswers[answerIndex].selectedOption = selectedOption;
    } else {
      updatedAnswers.push({
        quizId: quiz._id,
        selectedOption: selectedOption,
      });
    }
    setSelectedAnswers(updatedAnswers);
  };
  const calculateScore = () => {
    const totalQuestions = shuffledQuizzData.length;
    const correctAnswers = shuffledQuizzData.filter(
      (quiz: Quiz) => quiz.isCorrect
    ).length;
    const result = correctAnswers == shuffledQuizzData.length ? 100 : Math.ceil((correctAnswers / shuffledQuizzData.length) * 100);
    return result;
  };
  const calculateScoreHistory = useMemo(() => {
    if (dataHistory) {
      const totalQuestions = dataHistory.length;
      const correctAnswers = dataHistory.filter(
        (quiz: Quiz) => quiz.isCorrect
      ).length;
      const result = correctAnswers == totalQuestions ? 100 : Math.ceil((correctAnswers / totalQuestions) * 100);

      return result;
    }
  })
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const handleSubmit = () => {
    const allQuestionsAnswered = shuffledQuizzData.every((quiz: Quiz) => {
      const selectedAnswer = selectedAnswers.find(
        (answer: Answer) => answer.quizId === quiz._id
      );
      return selectedAnswer !== undefined;
    });

    if (allQuestionsAnswered) {
      setSubmitted(true);
      let totalCorrect = 0;
      shuffledQuizzData.forEach((quiz: Quiz) => {
        // Các logic để kiểm tra câu trả lời đúng
        const correctIndex = quiz.options.indexOf(quiz.correctAnswer);
        const selectedAnswer: Answer | undefined = selectedAnswers.find(
          (answer: Answer) => answer.quizId === quiz._id
        );

        if (selectedAnswer) {
          const selectedOptionIndex = quiz.options.indexOf(
            selectedAnswer.selectedOption
          );
          quiz.answer = selectedAnswer.selectedOption
          quiz.isCorrect = selectedOptionIndex === correctIndex;
          if (quiz.isCorrect) totalCorrect += 1;
        }
        refetchLessonData()
      });
      console.log("shuffledQuizzData________", shuffledQuizzData)
      // Tính điểm và lưu vào cơ sở dữ liệu
      const score = totalCorrect == shuffledQuizzData.length ? 100 : Math.ceil((totalCorrect / shuffledQuizzData.length) * 100);
      const lessonName = lessonData?.data.name || "";
      const lessonId = idLesson;
      const progressId = Courseprogress?.data?._id;
      const scoreData = {
        score,
        lessonName,
        lessonId,
        progressId,
        scoreNew: score
      };
      addScore(scoreData).then((res) => {
        refetchCourseProgress()
      });
      const bodyFormHistory = {
        lessonId: idLesson,
        userId: idUser,
        content: JSON.stringify(shuffledQuizzData)
      }
      setIsShowTest(false)
      setOpenTestModal(true)
      setCurrentIndex(0)
      addHistoryTest(bodyFormHistory).then(res => {
        refetchhistoryTestData()
      })
      // Đặt thời gian đếm ngược và xử lý nộp bài
      setTimeout(() => {
        setShowRetryButton(true);
      }, 10000);

      let countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      setCountdownInterval(countdownInterval);

      setTimeout(() => {
        if (countdownInterval) {
          clearInterval(countdownInterval);
        }
      }, 10000);
    } else {
      // Hiển thị thông báo hoặc thông báo lỗi nếu có câu hỏi chưa được chọn
      alert("Vui lòng chọn đáp án cho tất cả câu hỏi trước khi nộp bài.");
    }
  };
  const lessonIdToFind = idLesson;
  // Hàm để tìm điểm số theo lessonId
  const findScoreByLessonId = (lessonId, scores) => {
    const scoreObj = scores.find((score) => score.lessonId === lessonId);
    return scoreObj ? scoreObj : null;
  };
  // Lấy điểm số cho lessonId cụ thể
  const scoreData = Courseprogress
    ? findScoreByLessonId(lessonIdToFind, Courseprogress?.data?.scores)
    : null;

  //sửa lý lấy thời gian video
  const [currentTime, setCurrentTime] = useState(0);
  const [reached90PercentRef, setReached90PercentRef] = useState(false);
  const idScore = scoreData?._id;
  useEffect(() => {
    if (isShowTest) setIsShowTest(false)
    if (reached90PercentRef) setReached90PercentRef(false)

  }, [idLesson])
  // useEffect(() => {
  //   const video = document.querySelector("video");
  //   if (video) {
  //     video.addEventListener("timeupdate", () => {

  //       setCurrentTime(video.currentTime);
  //       const duration = video.duration;
  //       if (!reached90PercentRef && currentTime >= duration * 0.9) {
  //         setReached90PercentRef(true);
  //         console.log('Video has been viewed around 90%');
  //         const statusVideo = "hoàn thành video";
  //         console.log("statusVideo", statusVideo);
  //         const score = 0;
  //         const lessonName = lessonData?.data.name || "";
  //         const lessonId = idLesson;
  //         const progressId = Courseprogress?.data?._id;
  //         const scoreDatacreate = {
  //           score,
  //           lessonName,
  //           lessonId,
  //           progressId,
  //           statusVideo,
  //         };
  //         // Gọi hàm addScore và xử lý kết quả
  //         if (!scoreData) {
  //           addScore(scoreDatacreate)
  //           refetchLessonData()

  //         } else if (scoreData && !scoreData.statusVideo) {
  //           updateStatus({ id: idScore, statusVideo: statusVideo })
  //           refetchLessonData()
  //         }
  //       }
  //       setReached90PercentRef(false)
  //     });
  //   }



  // });

  const handleTimeUpdate = (event) => {
    // let idintervel = null
    const video = event.target;
    const progress = (video.currentTime / video.duration) * 100;
    // if (!idintervel) {
    //   idintervel = setTimeout(() => {
    //     clearInterval(idintervel)
    //   }, video.duration * 1000)
    //   if (idintervel) {
    //     video.currentTime <= 
    //   }
    // }
    // Lưu thời điểm hiện tại để so sánh lần sau
    // console.log("reached90PercentRef________", reached90PercentRef);
    // console.log("scoreData______________", scoreData);

    if (progress >= 90 && !reached90PercentRef) {
      setReached90PercentRef(true);
      const statusVideo = "hoàn thành video";
      const score = 0;
      const lessonName = lessonData?.data.name || "";
      const lessonId = idLesson;
      const progressId = Courseprogress?.data?._id;
      const scoreDatacreate = {
        score,
        scoreNew: score,
        lessonName,
        lessonId,
        progressId,
        statusVideo,
      };
      // Gọi hàm addScore và xử lý kết quả
      console.log("scoreData______________", scoreData);

      if (!scoreData) {
        addScore(scoreDatacreate).then(res => {
          refetchCourseProgress()
        })
        refetchLessonData()

      } else if (scoreData && !scoreData.statusVideo) {
        updateStatus({ id: idScore, statusVideo: statusVideo }).then(res => {
          refetchCourseProgress()
        })
        refetchLessonData()
      }
      // Add your specific logic here
    }
  };
  const handleSeeking = () => {
    // Lưu thời gian trước khi bắt đầu tua
    setPrevTime(videoRef.current.currentTime);
  };

  const handleSeeked = () => {
    // Kiểm tra điều kiện tua quá nhanh
    const currentTime = videoRef.current.currentTime;
    if (Math.abs(currentTime - prevTime) > 5) {
      // Nếu tua quá nhanh, đặt lại thời gian video
      videoRef.current.currentTime = prevTime;
      alert('Cảnh báo: Bạn đã tua video quá nhanh!')
      console.log('Cảnh báo: Bạn đã tua video quá nhanh!');
      // Thêm mã xử lý hoặc hiển thị cảnh báo của bạn ở đây
    }
  };
  const openModal = () => {
    if (scoreData?.statusVideo === "hoàn thành video" || reached90PercentRef) {
      if (currentIndex != 0) setCurrentIndex(0)
      handleRetry();
      setIsShowTest(true);
    } else {
      notification.warning({
        message: "Thông báo",
        description: "Bạn cần hoàn thành tối thiểu 90% bài giảng để làm bài kiểm tra.",
        placement: 'top',
      });
    }
  };
  const openModalHistory = () => {
    setOpenModalHistory(true)
  }
  // Hàm xử lý khi người dùng nhấn nút "Thử lại"
  const handleRetry = () => {
    setSubmitted(false);
    setSelectedAnswers([]);
    setShowRetryButton(false);
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }
    setCountdown(10);
  };
  // Sử dụng useEffect để xử lý dữ liệu khi nó thay đổi
  useEffect(() => {
    if (lessonData?.data.quizzs) {
      const quizDataFromAPI = lessonData.data.quizzs;
      const shuffledData: Quiz[] = quizDataFromAPI.map((quiz: Quiz) => ({
        ...quiz,
        options: shuffleArray([
          quiz.correctAnswer,
          quiz.Wronganswer1,
          quiz.Wronganswer2,
          quiz.Wronganswer3,
        ]),
      }));
      setShuffledQuizzData(shuffledData);

    }
  }, [lessonData]);

  // Hàm tính điểm
  // NoteLesson
  useEffect(() => {
    // Nạp danh sách ghi chú khi nó thay đổi
    
    if (notesData) {
    
      setNoteList(notesData);
    }
  }, [notesData]);
  // Note Function
  const startEditingNote = () => {
    setIsEditingNote(true);
  };
  const Context = React.createContext({ name: "Default" });
  const openNotificationDelete = (placement: any) => {
    notification.success({
      message: "Success",
      description: "Ghi chú đã được xóa thành công.",
      placement,
    });
  };
  const openNotificationDSave = (placement: any) => {
    notification.success({
      message: "Success",
      description: "Ghi chú đã được lưu thành công.",
      placement,
    });
  };
  const contextValue = useMemo(() => ({ name: "Ant Design" }), []);
  const quillRef = useRef(null);
  const toolbarOptions = [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["code-block", "blockquote"],
  ];
  const saveNote = async () => {
    if (quillRef.current) {
      const quillInstance = quillRef.current.getEditor();
      const noteContentHTML = quillInstance.root.innerHTML.trim();

      if (noteContentHTML !== "") {
        if (editingNoteIndex !== null) {
          const updatedNotes = [...noteList];
          const editedNoteIndex = editingNoteIndex;
          const editedNote = { ...updatedNotes[editedNoteIndex] };
          editedNote.content = noteContentHTML;

          console.log("Data sent from client when editing note:", editedNote);

          try {
            await updateNoteMutation(editedNote);
            updatedNotes[editedNoteIndex] = editedNote;
            setNoteList(updatedNotes);
            setIsEditingNote(false);
            setNoteContent("");
            setEditingNoteIndex(null);
          } catch (error) {
            console.error("Error editing note:", error);
          }
        } else {
          const newNote = {
            lessonId: lessonData?.data._id || "",
            title: lessonData?.data.name || "",
            content: noteContentHTML,
            video: lessonData?.data.video || "",
            minute: currentTime,
            userId: idUser
          };

          try {
            const response = await addNoteMutation(newNote);
            const updatedNotes = [...noteList, response];
            setNoteList(updatedNotes);
            setIsEditingNote(false);
            setNoteContent("");
            openNotificationDSave("bottomLeft");
          } catch (error) {
            console.error("Error adding new note:", error);
          }
        }
      }
    }
  };
  const cancelEditingNote = () => {
    setIsEditingNote(false);
    setNoteContent("");
  };
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const handleEditNote = (index: number) => {
    // Sử dụng ghi chú đã có để chỉnh sửa
    setNoteContent(noteList[index].content);
    setIsEditingNote(true);
    setEditingNoteIndex(index);
  };
  // Hàm để xóa ghi chú
  const handleDeleteNote = async (index: number) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa ghi chú này?"
    );

    if (confirmDelete) {
      const noteIdToDelete = noteList[index]._id;

      try {
        const response: any = await removeNoteMutation(noteIdToDelete);

        if (response.error) {
          console.error("Lỗi khi xóa ghi chú:", response.error);
        } else {
          const updatedNotes = [...noteList];
          updatedNotes.splice(index, 1);
          setNoteList(updatedNotes);

          // Hiển thị thông báo sau khi xóa thành công
          openNotificationDelete("bottomLeft");
        }
      } catch (error) {
        console.error("Lỗi khi xóa ghi chú:", error);
      }
    }
  };
  const showModal = (videoId: any) => {
    setSelectedVideoId(videoId);
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const MyCheckbox = ({
    isSelected,
    onChange,
  }: {
    isSelected: boolean;
    onChange: (checked: boolean) => void;
  }) => (
    <Checkbox
      checked={isSelected}
      onChange={(e: CheckboxChangeEvent) => onChange(e.target.checked)}
      className="mr-2"
    ></Checkbox>
  );

  if (!lessonData) {
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <RaceBy size={100} lineWeight={6} speed={1.4} color="#47d1d1" />
      <div
        className="mt-2 text-black font-medium"
        style={{ color: "#70dbdb" }}
      >
        Loading
      </div>
    </div>
  }


  // Lấy điểm số cho lessonId cụ thể
  const score = Courseprogress
    ? findScoreByLessonId(lessonIdToFind, Courseprogress.data.scores)
    : null;
  const handelCreateComment = (event: any) => {
    event.preventDefault();
    createCommentI({
      name: comment,
      idUser: userInfo.userData._id,
      idCourse: idProduct,
    })
      .unwrap()
      .then((rep: any) => {
        setComment('');
        setStatusCmtt(rep);
      });
  };
  const uniqueComments = (comments) => {
    const unique = new Map();
    comments.forEach((comment) => {
      if (!unique.has(comment._id)) {
        unique.set(comment._id, comment);
      }
    });
    return Array.from(unique.values());
  };
  return (
    <>
      <div className="  max-w-7xl mx-auto">
        {/* Phần hiển thị video */}
        {isShowTest ?
          <div className="h-[40%] ">

            {/* <p>Thời gian hiện tại của video: {currentTime} giây</p> */}

            {shuffledQuizzData.map((quiz: Quiz, index) => (
              <div
                key={quiz._id}
                id={`quiz-${quiz._id}`}

              >
                {index == currentIndex &&
                  <div>
                    {/* Tiêu đề của câu hỏi */}
                    <h3 className="font-bold text-xl mt-4 ml-3 mb-4">
                      Câu hỏi:{" "}
                      <samp className="font-medium text-lg">{quiz.name}</samp>
                    </h3>
                    {/* Danh sách các lựa chọn câu trả lời */}
                    <div className="grid grid-cols-2 gap-2">
                      {quiz.options.map((option: any, optionIndex: number) => {
                        // Kiểm tra xem lựa chọn này đã được chọn chưa
                        const isSelected = selectedAnswers.some(
                          (answer: any) =>
                            answer?.quizId === quiz._id &&
                            answer.selectedOption === option
                        );

                        let answerClassName =
                          "cursor-pointer bg-[#f0f0f0] text-dark font-semibold py-2 px-4 rounded-md mr-2 my-3 py-4 ml-2";
                        let borderStyle = "1px solid transparent";
                        let bgColor = "";
                        let color = "";
                        if (isSelected) {
                          answerClassName += "bg-blue-700"; // Câu trả lời đã chọn nhưng chưa gửi
                          borderStyle = "1px solid rgb(0, 147, 252)";
                          bgColor = "rgb(0, 147, 252)";
                          color = "#ffff"
                        }

                        return (
                          <button
                            key={optionIndex}
                            className={answerClassName}
                            onClick={() => {
                              !submitted && selectAnswer(quiz, option);
                              setSelectedQuestion(quiz._id);
                            }}
                            style={{
                              border: borderStyle,
                              backgroundColor: bgColor,
                              color: color
                            }}
                          >
                            {/* <MyCheckbox
                            isSelected={isSelected}
                            onChange={(checked: boolean) =>
                              !submitted && selectAnswer(quiz, option)
                            }
                          /> */}
                            {String.fromCharCode(65 + optionIndex)}. {option}
                          </button>

                        );
                      })}
                    </div>

                  </div>
                }


              </div>
            ))}
            <div className="grid grid-cols-2 gap-2 border-t-2 border-t-[#f0f0f0] mt-10">
              {currentIndex === 0 ?
                <button
                  className="bg-[#f0f0f0] text-black font-semibold px-3 py-2 rounded-lg my-4 mr-4 text-base"
                >
                  Câu hỏi trước
                </button>
                :
                <button
                  onClick={() => setCurrentIndex((prev) => prev - 1)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-semibold px-3 py-2 rounded-lg my-4 mr-4 text-base"
                >
                  Câu hỏi trước
                </button>
              }
              {currentIndex + 1 == shuffledQuizzData.length ?

                <button
                  onClick={handleSubmit}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-semibold px-3 py-2 rounded-lg my-4 mr-4 text-base"
                >
                  Nộp bài
                </button>
                :
                <button
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-semibold px-3 py-2 rounded-lg my-4 mr-4 text-base"
                >
                  Câu hỏi tiếp theo
                </button>
              }

            </div>

          </div>
          :
          <div className="h-[40%] ">
            <video
              ref={videoRef}
              key={videoSourceUrl}
              onTimeUpdate={handleTimeUpdate}
              controls
              width="100%"
              height="auto"
            >
              <source src={videoSourceUrl} type="video/mp4" />
            </video>

          </div>
        }


        {/* Phần hiển thị danh sách câu hỏi và câu trả lời */}
        <div className="justify-center w-full mt-10">
          <div className="">
            {isEditingNote ? (
              <div className="max-w-screen-xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white shadow-lg rounded-lg">
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-3 text-[#50c9c3] text-gradient-[#96deda] text-gradient-[#50c9c3]">
                      Sửa ghi chú
                    </h2>

                    <ReactQuill
                      theme="snow"
                      value={noteContent}
                      onChange={setNoteContent}
                      className="rounded mb-3"
                      modules={{
                        toolbar: toolbarOptions,
                      }}
                      placeholder="Viết ghi chú của bạn ở đây..."
                      style={{ height: "150px" }}
                      ref={quillRef}
                    />
                    <div className="text-right mt-10">
                      <button
                        onClick={cancelEditingNote}
                        className="px-4 py-1 rounded-md transition duration-300 mr-3 font-medium border-4 border-transparent
  hover:border-4 hover:border-gradient-to-r hover:from-[#13547a] hover:to-[#80d0c7]
  from-blue-400 to-purple-600 hover:text-eef4fc hover:bg-opacity-50 mt-4"
                        style={{
                          backgroundColor: "#f6f7f9",
                          color: "#04a0ff",
                          borderRadius: "8px",
                        }}
                      >
                        Hủy bỏ
                      </button>

                      <button
                        onClick={saveNote}
                        className="px-4 py-2 text-white rounded-md transition duration-300
  bg-gradient-to-r from-[#96deda] to-[#50c9c3] hover:bg-gradient-to-r
  hover:from-[#B7F8DB] hover:to-[#50A7C2] hover:rounded-full font-medium"
                        style={{
                          backgroundColor:
                            "transparent" /* Đặt màu nền trong suốt */,
                          color: "#f6f7f9" /* Mã màu phông */,
                          borderRadius: "10px" /* Góc bo tròn ban đầu */,
                        }}
                      >
                        Lưu ghi chú
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="">
                <div className="flex flex-row-reverse justify-between">
                  <div
                    className="flex rounded p-2 hover:cursor-pointer"
                    onClick={showDrawer}
                  >
                    <h2
                      className=" font-semibold mr- text-lg mr-2"
                      style={{
                        background: "linear-gradient(135deg, #B7F8DB, #50A7C2)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Danh sách ghi chú
                    </h2>
                    <FaRegStickyNote
                      style={{
                        fontSize: "24px",
                        cursor: "pointer",
                        color: "#50A7C2",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    />
                  </div>

                  <Drawer
                    title="Danh sách ghi chú"
                    placement="right"
                    onClose={onClose}
                    open={open}
                  >
                    <ul className="">
                      {noteList.map((note: any, index: any) => {
                        console.log(note);
                        return (
                          <li
                            key={index}
                            className={note.userId && note.userId == idUser ? 'mx-1 my-6 border-b-2 border-gray-300 pb-4' : 'hidden mx-1 my-6 border-b-2 border-gray-300 pb-4'}
                          >

                            <div className="">
                              <div className="flex mb-2">
                                <p className="font-medium">IIFE, Scope, Closure</p>
                                <h3 className="ml-3 text-teal-500 font-medium">
                                  {note.title}
                                </h3>
                              </div>
                              <div className="float-right">
                                <button
                                  onClick={() => handleEditNote(index)}
                                  className="text-lg"
                                >
                                  <AiFillEdit />
                                </button>
                                <Context.Provider value={contextValue}>
                                  {contextHolder}
                                  <Space>
                                    <button
                                      onClick={() => handleDeleteNote(index)}
                                      className="ml-2 text-lg"
                                    >
                                      <FiDelete />
                                    </button>
                                  </Space>
                                </Context.Provider>
                              </div>
                            </div>
                            <div className="flex">
                              <strong className="mr-5">Ghi chú:</strong>
                              <div className="flex items-center">
                                <h3 className="font-bold">{note?.minute ? Math.ceil(note?.minute) : 0}</h3><p>(giây)</p>
                              </div>
                            </div>

                            <div className="flex mt-2 mb-6">
                              <p
                                dangerouslySetInnerHTML={{
                                  __html: note?.content?.substring(0, 170),
                                }}
                              />

                            </div>
                            <div
                              className="text-xl flex text-center"
                              onClick={() => showModal(note.video)}
                              style={{ cursor: "pointer", color: "#ff758c" }}
                            >
                              <MdSlowMotionVideo />

                              <span className="ml-2 text-sm">Xem lại bài học</span>
                            </div>
                            <Modal
                              title="Video Bài học"
                              open={isModalVisible}
                              onCancel={handleCancel}
                              footer={null}
                              style={{ background: "rgba(0, 0, 0, 0.5)" }}
                              mask={false} // Đặt giá trị này thành false để không có nền mờ
                              width={800} // Đặt chiều rộng theo mong muốn
                              height={400} // Đặt chiều cao theo mong muốn
                            >
                              <iframe
                                width="100%"
                                height="400"
                                src={note.video}
                                title="Video"
                                allowFullScreen
                              ></iframe>
                              <Link
                                to={`/video/${productData?.data._id}/lesson/${idOfLesson0}`}
                              >
                                <div className="flex justify-end items-center font-bold uppercase mt-4 text-base py-2 px-3 ml-100 hover:cursor-pointer">
                                  <style>
                                    {`.gradient-text {
                                   background: -webkit-linear-gradient(45deg, #ff1b6b, #45caff);
                                  -webkit-background-clip: text;
                                  -webkit-text-fill-color: transparent;
                                  display: inline;
                                 }`}
                                  </style>
                                  <p className="mr-2 gradient-text hover:bg-gray-50">
                                    Đi tới bài học
                                  </p>
                                  <BsArrowRight className="gradient-text bg-gradient-to-r from-purple-500 to-pink-500 " />
                                </div>
                              </Link>
                            </Modal>
                          </li>
                        )
                      })}
                    </ul>
                  </Drawer>

                  <div
                    className="flex items-center md:px-5 px-1 py-2 rounded-2xl"
                    style={{
                      background: "linear-gradient(135deg, #96deda, #50A7C2)",
                    }}
                    onClick={startEditingNote}
                  >
                    <AiOutlinePlus className="text-white cursor-pointer" />
                    <button className="ml-1 text-white lg:text-lg">
                      Thêm ghi chú
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Test */}
          <div className="flex items-center  justify-between">
            <div className="flex items-center ">
              {!isShowTest &&
                <div className="flex items-center ">
                  <button
                    id="kiem-tra"
                    className="text-2xl font-semibold underline hover:underline-offset-4 mt-8"
                    onClick={openModal}
                  >
                    Kiểm tra bài học
                  </button>
                  <div className="mt-9 ml-3 text-xl">
                    <FaRegHandPointLeft />
                  </div>
                </div>
              }


            </div>
            <div className="flex items-center">
              {historyTestData?.data &&
                <>
                  <button
                    id="kiem-tra"
                    className="text-2xl font-semibold underline hover:underline-offset-4 mt-8"
                    onClick={openModalHistory}
                  >
                    Lịch sử làm bài
                  </button>
                  <div className="mt-9 ml-3 text-xl">
                    <FaRegHandPointLeft />
                  </div>
                </>
              }
            </div>
          </div>

          <Modal
            title=""
            centered
            visible={openTestModal}
            onOk={() => setOpenTestModal(false)}
            onCancel={() => { handleRetry(), setOpenTestModal(false) }}
            width={800}
            footer={null}
            bodyStyle={{
              maxHeight: "100vh",
              overflowY: "auto",
              minHeight: "90vh",
              backgroundColor: "#f6f7f9",
            }}
            className="my-8"
          >
            <div className="flex justify-end">
              <p className="mt-2 text-lg mt-8 mr-4">
                Số điểm: {calculateScore()}/100
              </p>
            </div>
            {/* <p className="mt-2 text-lg">Điểm cao nhất cho bài học {score} điểm</p> */}
            {shuffledQuizzData.map((quiz: Quiz) => (
              <div
                key={quiz._id}
                id={`quiz-${quiz._id}`}

              >
                {/* Tiêu đề của câu hỏi */}
                <h3 className="font-bold text-xl mt-4 ml-3">
                  Câu hỏi:{" "}
                  <samp className="font-medium text-lg">{quiz.name}</samp>
                </h3>
                {/* Danh sách các lựa chọn câu trả lời */}
                <ul className=" px-2 py-4 w-full max-w-3xl">
                  {quiz.options.map((option: any, optionIndex: number) => {
                    // Kiểm tra xem lựa chọn này đã được chọn chưa
                    const isSelected = selectedAnswers.some(
                      (answer: any) =>
                        answer?.quizId === quiz._id &&
                        answer.selectedOption === option
                    );

                    let answerClassName =
                      "cursor-pointer bg-white text-dark font-semibold py-2 px-4 rounded-md mr-2 my-3 py-4 ml-2";
                    let borderStyle = "1px solid transparent";
                    let bgColor = "";

                    if (submitted) {
                      if (isSelected && quiz.isCorrect) {
                        answerClassName += " bg-green-500"; // Câu trả lời đúng
                        borderStyle = "1px solid #48bd79";
                        bgColor = "#f0ffed";
                      } else if (isSelected && !quiz.isCorrect) {
                        answerClassName += " bg-red-500";
                        borderStyle = "1px solid #cc5140";
                        bgColor = "#fff9f9";
                      }
                    } else if (isSelected) {
                      answerClassName += "bg-blue-700"; // Câu trả lời đã chọn nhưng chưa gửi
                      borderStyle = "1px solid rgb(0, 147, 252)";
                    }

                    return (
                      <li
                        key={optionIndex}
                        disabled
                        className={answerClassName}
                        onClick={() => {
                          !submitted && selectAnswer(quiz, option);
                          setSelectedQuestion(quiz._id);
                        }}
                        style={{
                          border: borderStyle,
                          backgroundColor: bgColor,
                        }}
                      >
                        {/* <MyCheckbox
                          isSelected={isSelected}
                          onChange={(checked: boolean) =>
                            !submitted && selectAnswer(quiz, option)
                          }
                        /> */}
                        {String.fromCharCode(65 + optionIndex)}. {option}
                      </li>

                    );
                  })}
                </ul>
              </div>
            ))}

            {/* Thông báo thời gian chờ trước khi có thể thử lại */}
            {submitted && countdown > 0 && (
              <p className="mt-4 text-lg">
                Bạn sẽ có thể làm lại sau {countdown} giây
              </p>
            )}

            {/* Nút "Làm lại" và điểm số */}
            {showRetryButton && (
              <div className="flex justify-end">
                <button
                  className="bg-yellow-400 hover.bg-yellow-500 text-white font-semibold px-3 py-2 rounded-md my-4 mr-4 flex justify-end text-base"
                  onClick={() => { handleRetry(), setOpenTestModal(false), setIsShowTest(true) }}
                >
                  Làm lại
                </button>
              </div>
            )}
          </Modal>

          <Modal
            title="Lịch sử làm bài Test"
            centered
            visible={isOpenModalHistory}
            onCancel={() => { setOpenModalHistory(false) }}
            width={800}
            footer={null}
            bodyStyle={{
              maxHeight: "100vh",
              overflowY: "auto",
              minHeight: "90vh",
              backgroundColor: "#f6f7f9",
            }}
            className="my-8"
          >
            <div className="flex justify-end">
              <p className="mt-2 text-lg mt-8 mr-4">
                Số điểm: {calculateScoreHistory}/100
              </p>
            </div>
            {/* <p className="mt-2 text-lg">Điểm cao nhất cho bài học {score} điểm</p> */}
            {dataHistory?.map((quiz: Quiz) => (
              <div
                key={quiz._id}
                id={`quiz-${quiz._id}`}

              >
                {/* Tiêu đề của câu hỏi */}
                <h3 className="font-bold text-xl mt-4 ml-3">
                  Câu hỏi:{" "}
                  <samp className="font-medium text-lg">{quiz.name}</samp>
                </h3>
                {/* Danh sách các lựa chọn câu trả lời */}
                <ul className=" px-2 py-4 w-full max-w-3xl">
                  {quiz.options.map((option: any, optionIndex: number) => {
                    // Kiểm tra xem lựa chọn này đã được chọn chưa
                    const isSelected = quiz.answer === option

                    let answerClassName =
                      "cursor-pointer bg-white text-dark font-semibold py-2 px-4 rounded-md mr-2 my-3 py-4 ml-2";
                    let borderStyle = "1px solid transparent";
                    let bgColor = "";

                    if (isSelected && quiz.isCorrect) {
                      answerClassName += " bg-green-500"; // Câu trả lời đúng
                      borderStyle = "1px solid #48bd79";
                      bgColor = "#f0ffed";
                    } else if (isSelected && !quiz.isCorrect) {
                      answerClassName += " bg-red-500";
                      borderStyle = "1px solid #cc5140";
                      bgColor = "#fff9f9";
                    }
                    return (
                      <li
                        key={optionIndex}
                        className={answerClassName}
                        disabled
                        style={{
                          border: borderStyle,
                          backgroundColor: bgColor,
                        }}
                      >
                        {/* <MyCheckbox

                          isSelected={isSelected}
                        /> */}
                        {String.fromCharCode(65 + optionIndex)}. {option}
                      </li>

                    );
                  })}
                </ul>
              </div>
            ))}
            {!isShowTest &&
              <div className="flex justify-end">
                <button
                  className="bg-blue-500 hover.bg-yellow-500 text-white font-semibold px-3 py-2 rounded-md my-4 mr-4 flex justify-end text-base"
                  onClick={() => { setOpenModalHistory(false), handleRetry(), setIsShowTest(true) }}
                >
                  Làm lại
                </button>

              </div>
            }

          </Modal>
        </div>
        {/* Phần hiển thị và gửi bình luận */}
        <div className="border-2 mt-20 p-8">
          <div className="mt-4 w-full">
            <div className="bg-white p-4 w-full">
              <h1 className="text-2xl font-semibold">Bình luận</h1>
              {/* Phần nhập và gửi bình luận mới */}
              <div className="mt-4">
                <div className="flex items-start space-x-2">
                  <div className="avatar-container">
                    <img src={userInfo.userData.img ? userInfo.userData.img : 'https://img.myloview.com/posters/default-avatar-profile-icon-vector-social-media-user-photo-700-205577532.jpg'} alt="" />
                    <p className="font-semibold">{userInfo.userData.name}</p>
                  </div>
                </div>

                <form onSubmit={handelCreateComment}>
                  <input
                    value={comment}
                    onChange={(event: any) => setComment(event.target.value)}
                    className="mt-2 w-full h-10 rounded-lg border-2 pl-3 outline-none border-gray-300 "
                    placeholder="Viết bình luận của bạn..."
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-semibold py-2 px-2 rounded-md"
                  >
                    Gửi bình luận
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Danh sách bình luận */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold">Bình luận đã gửi:</h2>
            <div className="mt-4">
              <div className="flex items-start space-x-2">
                <div>
                  {demo
                    ?.filter((items: any) => items.status == "true")
                    .map((comment: any, index) => {
                      // console.log(comment, "true");
                      return <Comment key={index} comment={comment} />;
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Videodetail;
