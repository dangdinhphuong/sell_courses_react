import React, { useEffect, useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useGetProductsQuery } from "@/Api/productApi";
import { useGetOderMoneyQuery } from "@/Api/getOrderMany";
import { useGetOrdersQuery } from "@/Api/order";
import { AiOutlineEye, AiFillEye } from "react-icons/ai";
import { Table, DatePicker, Button, Drawer, DrawerProps } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import { Excel } from "antd-table-saveas-excel";
import _ from "lodash";
import { RangePickerProps } from "antd/es/date-picker";
import ExcelJS from "exceljs";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import * as XLSX from "xlsx";
import moment from "moment";
import { formatDate } from "@/utils/formats"

export const exportToExcel = (data: any, fileName: any) => {
  console.log(data, "dataa");
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");
  const columns = Object.keys(data[0]);
  worksheet.addRow(columns);
  data.forEach((item: any) => {
    const row: any[] = [];
    columns.forEach((column) => {
      row.push(item[column]);
    });
    worksheet.addRow(row);
  });
  workbook.xlsx.writeBuffer().then((buffer: any) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.xlsx`;
    a.click();
  });
};
const Dashboard = () => {
  const [openTop, setOpenTop] = useState(false);
  const [query, setQuery] = useState({})
  const [placement, setPlacement] = useState<DrawerProps['placement']>('top');
  const showDrawerTop = () => {
    setOpenTop(true);
  };
  const onCloseTop = () => {
    setOpenTop(false);
  };
  const { data: productData, isLoading } = useGetProductsQuery();
  console.log("productsssssssssssssssssssssss", productData);

  const navigate = useNavigate();
  const [alltotal, setAltotal] = useState(false);
  const [open, setOpen] = useState(false);
  const [dataOnDay, SetDataOmday] = useState<any[][]>([]);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const [loggerDate, setLoggerDate] = useState({
    startDate: "",
    endDate: "",
  });
  const { data: moneyData } = useGetOderMoneyQuery(query);
  console.log(moneyData?.data?.docs, "pl");
  const [options5, setoptions5] = useState({
    page: 1,
    limit: 30,
    startDate: "",
    endDate: "",
  });
  const memoOptions = useMemo(() => {
    setoptions5((prev) => ({
      ...prev,
      startDate: loggerDate.startDate,
      endDate: loggerDate.endDate,
    }));
  }, [loggerDate]);
  useEffect(() => {
    // Check if necessary data is available before processing
    if (productData && productData.data && moneyData && moneyData.data) {
      // Process data and update state...
    }
  }, [loggerDate, memoOptions, options5, productData, moneyData]);
  const today = new Date();
  const todayDate = today.toISOString().split("T")[0];
  let totalRevenue = 0;
  let arrDataOnday: any[] = [];
  const { data: orderData }: any = useGetOrdersQuery();
  let totalYear: any[] = []
  const demo = orderData?.data?.filter((items: any) => items.orderStatus == "Done")
    ?.map((item: any) => {
      totalYear.push(item)
      return Number(item.payment.paymentAmount);
    })
    .reduce((total: any, order: any) => total + order, 0);
  console.log(totalYear)
  const getDataDay = orderData?.data?.filter((items: any) => items.orderStatus == "Done")?.map((item: any) => {
    const paymentDate = item.payment.paymentDate.split("T")[0];
    const paymentAmount = item.payment.paymentAmount;
    if (paymentDate === todayDate) {
      totalRevenue += Number(paymentAmount);
      arrDataOnday.push(item);
    }
    return {
      paymentDate,
      paymentAmount,
    };
  });
  useEffect(() => {
    const dataDay = [
      ...arrDataOnday?.map((items: any) => [
        items?._id,
        items?.course?.name,
        items?.course?.price,
        items?.user?.name,
      ]),
    ];
    SetDataOmday([...dataDay]);
  }, []);
  console.log(arrDataOnday, "lol");
  const [dataFreeChart, setDataFreeChart] = useState(0);
  const [dataChart, setDataChart] = useState(0);
  const [courseNames, setCourseNames] = useState<any>([]);
  const [courseRevenues, setCourseRevenues] = useState<any>([]);
  const [courseRevenuesMonth, setCourseRevenuesMonth] = useState(false);

  const processRevenueData = (data) => {
    return Object.keys(data)?.map((year) => {
      const monthlyRevenues = Object.values(data[year])?.map((month: any) => {
        if (
          typeof month == "object" &&
          month.hasOwnProperty("$numberDecimal")
        ) {
          return parseFloat(month["$numberDecimal"]);
        }
        return month.$numberDecimal;
      });
      return {
        name: year,
        data: monthlyRevenues,
      };
    });
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("http://localhost:8088/api/revenue");
        const processedData = processRevenueData(data);
        // setCourseRevenues(processedData);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (productData && productData.data && orderData && orderData.data) {
      const courseNames = productData.data?.map((course) => course.name);
      const courseRevenues: any = courseNames?.map((courseName) => {
        const courseOrders: any = orderData.data?.filter(
          (order: any) => order.course?.name === courseName
        );
        const revenue = courseOrders
          .map((dataa: any) => {
            return Number(dataa.course.price);
          })
          .reduce((total: any, order: any) => total + order, 0);
        return revenue;
      });
      setCourseNames(courseNames);
      console.log("courseRevenues x1", courseRevenues)
      setCourseRevenues(courseRevenues);
    }
  }, [productData, orderData]);

  useEffect(() => {
    if (productData && productData.data) {
      const freeCourses = productData.data?.filter(
        (data) => data.price === "0"
      ).length;
      const paidCourses = productData.data?.filter(
        (data) => data.price !== "0"
      ).length;
      setDataFreeChart(freeCourses);
      setDataChart(paidCourses);
    }
  }, [productData]);
  const calculateNewCoursesByMonth = () => {
    if (productData && productData.data) {
      const courses = productData.data;
      const newCoursesByMonth: any = {};
      courses.forEach((course) => {
        const createdAt = new Date(course.createdAt);
        const monthKey = `${createdAt.getFullYear()}-${createdAt.getMonth() + 1
          }`;
        if (!newCoursesByMonth[monthKey]) {
          newCoursesByMonth[monthKey] = [course.name]; // Lưu tên khoá học trong một mảng
        } else {
          newCoursesByMonth[monthKey].push(course.name);
        }
      });
      return newCoursesByMonth;
    }
    return {};
  };
  const newCoursesByMonth = calculateNewCoursesByMonth();
  const chartData2 = Object.keys(newCoursesByMonth)?.map((month) => ({
    name: month,
    y: newCoursesByMonth[month].length,
    courses: newCoursesByMonth[month]?.map((courseName: any) => ({
      name: courseName,
      quantity: 1,
    })),
  }));
  const options2 = {
    chart: {
      type: "column",
    },
    title: {
      text: "Khoá Học Mới Nhất Theo Tháng",
    },
    xAxis: {
      type: "category",
    },
    yAxis: {
      min: 0,
      title: {
        text: "Số Lượng",
      },
    },
    series: [
      {
        name: "Số Lượng",
        colorByPoint: true,
        data: chartData2,
      },
    ],
  };
  const chartData = [
    { name: "Khoá Học Trả Phí", y: dataChart },
    { name: "Khoá Học Miễn Phí", y: dataFreeChart },
  ];
  // Hàm để lấy màu dựa trên index
  const getColorForIndex = (index) => {
    // Điều chỉnh logic tạo màu tùy thuộc vào index
    // Ví dụ đơn giản: sử dụng một mảng màu cố định
    const colors = ['#3452eb'/* ... */];

    return colors[index % colors.length];
  };
  const columnOptions = {
    chart: {
      type: "column",
    },
    title: {
      text: "Doanh Thu Từng Khóa Học",
    },
    xAxis: {
      categories: courseNames,
    },
    yAxis: {
      min: 0,
      title: {
        text: "Doanh Thu",
      },
    },
    series: [
      {
        name: "Doanh Thu",
        pointPadding: 0.1, // Điều chỉnh khoảng cách giữa các cột
        groupPadding: 0.2, // Điều chỉnh khoảng cách giữa các nhóm cột
        colorByPoint: true, // Chọn màu cho mỗi cột
        data: [
          1100000,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          30000,
          0,
          0,
          0
        ]?.map((revenue: any, index) => ({
          y: revenue,
          color: getColorForIndex(index), // Hàm này trả về màu cho từng cột
        })),
      },
    ],
  };
  const columnOptions3 = {
    chart: {
      type: "column",
    },
    title: {
      text: "Doanh Thu Theo Tháng",
    },
    xAxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    yAxis: {
      min: 0,
      title: {
        text: "Doanh Thu",
      },
    },
    series: courseRevenues,
  };
  const options = {
    chart: {
      type: "pie",
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false, // Kích thước chiều cao cố định
    },
    title: {
      text: "Biểu Đồ Thống Kê Khóa Học",
      align: 'center'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: false
        },
        showInLegend: true
      }
    },
    series: [
      {
        name: "Số Lượng",
        colorByPoint: true,
        data: chartData,
      },
    ],
  };
  const columns = [
    {
      title: "Tên Người Mua",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },

    {
      title: "Tên Khoá Học",
      dataIndex: "courseName",
      key: "courseName",
    },
    {
      title: "Giá Tiền",
      dataIndex: "paymentAmount",
      key: "paymentAmount",
      render: (text: any) => `${text?.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
      })}`,
    },
    {
      title: "Thời Gian Mua",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (text: any) => {
        const db = text.split("T");
        return <p> {formatDate(db[0],"DD-MM-YYYY")}</p>;
      },
    },
  ];
  const data = orderData
    ? orderData.data
      ?.map((order: any, index: any) => ({
        key: index,
        orderDate: order?.orderDate,
        courseName: order?.course?.name,
        paymentAmount: order.payment?.paymentAmount,
        userName: order?.user?.name,
        email: order?.user?.email,
        phone: order?.user?.phoneNumber
      }))
      .sort((a: any, b: any) => new Date(b.orderDate) - new Date(a.orderDate))
    : [];
  const onDateChange: RangePickerProps["onChange"] = (_, dateString) => {
    setLoggerDate({ startDate: dateString[0], endDate: dateString[1] });
    navigate({
      search: createSearchParams({
        startDate: dateString[0],
        endDate: dateString[1],
      }).toString(),
    });
  };
  console.log(moneyData?.data?.docs)
  let total = moneyData?.data?.docs?.filter((items: any) => items.orderStatus == "Done").reduce((sum, item) => {
    return sum + Number(item?.payment?.paymentAmount || 0);
  }, 0);
  console.log(total)
  const dataSourceMoney = moneyData?.data?.docs?.map(
    ({ orderStatus, payment, orderDate }: any, index: number) => ({
      key: index + 1,
      orderStatus: orderStatus,
      payment: payment,
      orderDate: orderDate,
    })
  );
  const dataSourceMoneyDymanic = moneyData?.data?.docs?.map(
    (items: any, index: number) => ({
      key: items._id,
      name: items?.course?.name,
      price: items?.payment?.paymentAmount,
      user: items?.user?.name,
    })
  );
  const handleSearchDate = val => {
    console.log("val________", val)

    if (val) {
      const startDate = moment(val[0].$d).format("YYYY-MM-DDTHH:mm:ss.SSSZ")
      const endDate = moment(val[1].$d).format("YYYY-MM-DDTHH:mm:ss.SSSZ")
      console.log(startDate, endDate)
      setQuery(prev => {
        return { ...prev, startDate: startDate, endDate: endDate }
      })
    } else {
      setQuery({})
    }


  }
  const columnsMoney = [
    {
      title: "Id",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Trạng Thái",
      dataIndex: "orderStatus",
      key: "logType",
      render: (text: string) => {
        let colorType = "";
        let textColor = ""; // Màu chữ cho trạng thái

        switch (text.toLowerCase()) {
          case "update":
            colorType = "text-warning font-bold text-md";
            break;
          case "thất bại":
            colorType = "text-danger font-bold text-md";
            textColor = "#e83f44"; // Màu chữ cho trạng thái "Thất bại"
            break;
          case "done":
            colorType = "text-success font-bold text-md";
            textColor = "green"; // Màu chữ cho trạng thái "Thành công"
            text = "Thành công"; // Thay đổi hiển thị từ "Done" thành "Thành công"
            break;
          default:
            colorType = "text-blue font-bold text-md"; // Màu chữ mặc định cho trạng thái khác
        }

        const style = {
          color: textColor, // Sử dụng màu chữ cho trạng thái "Thành công" và "Thất bại"
        };

        return <p className={`${colorType}`} style={style}>{text}</p>;
      },

    },
    {
      title: "Thanh Toán",
      dataIndex: "payment",
      key: "payment",
      render: (data: any) => {
        console.log(data);
        return <p>{data.paymentMethod}</p>;
      },
    },
    {
      title: "Giá Tiền",
      dataIndex: "payment",
      key: "payment",
      render: (data: any) => {
        return <p>{
          new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(data.paymentAmount)}</p>;
      },
    },
    {
      title: "Ngày Tạo",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (data: string) => {
        return <p>{formatDate(data.split("T")[0], "DD-MM-YYYY")}</p>;
      },
    },
  ];
  const dataSourceTotalDay =
    arrDataOnday &&
    arrDataOnday?.map((items: any, index: number) => ({
      key: items._id,
      name: items?.course?.name,
      price: items?.course?.price,
      user: items?.user?.name,
    }));

  const dataSourceYear =
    totalYear &&
    totalYear?.map((items: any, index: number) => ({
      key: items._id,
      name: items?.course?.name,
      price: items?.course?.price,
      user: items?.user?.name,
    }));
  const columnsToTalDay = [
    {
      title: "Id",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Tên Khóa Học",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá Tiền",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Tên Người Mua",
      dataIndex: "user",
      key: "user",
    },
    {
      render: ({ key: _id }: { key: string }) => (
        <Button
          style={{ paddingLeft: "4px" }}
          className="w-7 h-7 mr-2"
          type="default"
        >
          <Link to={`/admin/orders/${_id}`} onClick={showDrawer}>
            <AiOutlineEye className="text-xl text-primary text-black" />
          </Link>
        </Button>
      )
    },
  ];

  return (
    <div className="bg-gray-100 p-6 rounded-md">
      <>
        <Drawer
          title="Chi tiết doanh thu"
          placement='right'
          onClose={onCloseTop}
          open={openTop}
          width={800}
        >
          <div>
            <div className="flex justify-end">
              <Button
                onClick={() => exportToExcel(totalYear, "all")}
                className="mb-5"
              >
                Xuất Excel
              </Button>
            </div>

            <Table
              dataSource={dataSourceYear}
              columns={columnsToTalDay}
            />
          </div>
        </Drawer>




        <Drawer
          title="Chi tiết doanh thu"
          width={800}
          placement="right"
          onClose={onClose}
          open={open}
        >
          {alltotal ? (
            <>
              <div className="flex justify-end">
                <Button
                  onClick={() => exportToExcel(arrDataOnday, "test")}
                  className="mb-5"
                >
                  Xuất Excel
                </Button>
              </div>

              <Table
                dataSource={dataSourceTotalDay}
                columns={columnsToTalDay}
              />
            </>
          ) : (
            <div>
              <div className="flex justify-end">
                <Button
                  onClick={() => exportToExcel(moneyData?.data?.docs, "all")}
                  className="mb-5"
                >
                  Xuất Excel
                </Button>
              </div>

              <Table
                dataSource={dataSourceMoneyDymanic}
                columns={columnsToTalDay}
              />
            </div>
            //
          )}
        </Drawer>
      </>
      {courseRevenuesMonth ? (
        <div>..... loading</div>
      ) : (
        <div>
          <div className="flex justify-center mb-10">
            <div className="flex gap-11">
              <div className="rounded-md border border-stroke bg-gradient-to-br from-[#18A5A7] to-[#BFFFC7] py-10 px-6 shadow-default dark:border-strokedark dark:bg-boxdark w-64">
                <div className="">
                  <div>
                    <h4 className="text-title-md text-white font-bold text-black text-xl ">
                      Doanh Thu Tổng
                    </h4>
                  </div>
                  <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                    <img className="w-[60px]" src={""} alt="" />
                  </div>
                </div>
                <div className="flex items-end justify-between mt-4">
                  <div>
                    <h4 className="text-title-md text-white font-bold text-black text-lg">
                      {demo?.toLocaleString()} VND
                    </h4>
                    <p onClick={showDrawerTop} className="text-sm pt-2 font-medium underline tex-lg cursor-pointer text-white">
                      Total views
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-md border border-stroke bg-gradient-to-br from-[#6D678E] to-[#F6B5CC] py-10 px-6 shadow-default dark:border-strokedark dark:bg-boxdark w-64 text-white">
                <div className="items-center">
                  <div>
                    <h4 className="text-title-md text-white font-bold text-black text-xl">
                      Doanh Thu Năm
                    </h4>
                  </div>
                  <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                    <img className="w-[60px]" src={""} alt="" />
                  </div>
                </div>
                <div className="flex items-end justify-between mt-4">
                  <div>
                    <h4 className="text-title-md text-white font-bold text-black text-lg">
                      {demo?.toLocaleString()} VND
                    </h4>
                    <p onClick={showDrawerTop} className="text-sm pt-2 font-medium underline text-lg cursor-pointer">
                      Total views
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-md border border-stroke bg-gradient-to-br from-[#5D69BE] to-[#C89FEB] py-10 px-6 shadow-default dark:border-strokedark dark:bg-boxdark w-64">
                <div className=" items-center">
                  <div>
                    <h4 className="text-title-md text-white font-bold text-black text-xl">
                      Doanh Thu Ngày
                    </h4>
                  </div>
                  <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                    <img className="w-[60px]" src={""} />
                  </div>
                </div>
                <div className="flex items-end justify-between mt-4">
                  <div>
                    <h4 className="text-title-md text-white font-bold text-black text-lg">
                      {totalRevenue?.toLocaleString()} VND
                    </h4>
                    <p
                      onClick={() => {
                        showDrawer();
                        setAltotal(true);
                      }}
                      className="text-sm pt-2 font-medium underline cursor-pointer text-white"
                    >
                      Total views
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-md border border-stroke bg-gradient-to-br from-[#ABF8E7] to-[#9C35B6] py-10 px-6 shadow-default dark:border-strokedark dark:bg-boxdark w-64">
                <div className="items-center">
                  <div>
                    <h4 className="text-title-md text-white font-bold text-black text-xl">
                      Doanh Thu Theo Lịch
                    </h4>
                  </div>
                  <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                    <img className="w-[60px]" src={""} />
                  </div>
                </div>
                <div className="flex items-end justify-between mt-4">
                  <div>
                    <h4 className="text-title-md text-white font-bold text-black text-lg">
                      {total?.toLocaleString()} VND
                    </h4>
                    <p
                      onClick={() => {
                        showDrawer();
                        setAltotal(false);
                      }}
                      className="text-sm pt-2 font-medium underline cursor-pointer text-white"
                    >
                      Total views
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-10">
            <HighchartsReact highcharts={Highcharts} options={columnOptions} />
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 flex justify-between">

              <HighchartsReact highcharts={Highcharts} options={options} />
            </div>
            <div className="col-span-2">
              <div className="mr-5">
                <DatePicker.RangePicker onChange={handleSearchDate} />
              </div>
              <p className="flex justify-center mb-4 text-xl font-bold text-gray-800">Đơn hàng theo lịch </p>
              <div className="">
                <Table
                  className="mt-5"
                  dataSource={dataSourceMoney}
                  columns={columnsMoney}
                  pagination={{ pageSize: 6 }}
                />
              </div>
            </div>

          </div>


          {/* theo thang */}
          {/* <HighchartsReact highcharts={Highcharts} options={columnOptions3} /> */}
          {/*  */}
          <div className="grid grid-cols-2 gap-5 mt-20">

            <div className="rounded-md shadow-md">
              <h2 className="flex justify-center mb-4 text-xl font-bold text-gray-800">
                Thống Kê Người Mua Gần Nhất
              </h2>

              <div className="items-center w-full">
                <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} className="" />
              </div>
            </div>
            <div className="">
              <HighchartsReact highcharts={Highcharts} options={options2} />
            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default Dashboard;