import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import { FaRupeeSign } from "react-icons/fa";
import api from "../../utils/axios";
import { useLocation } from "react-router-dom";
import { TextField } from "@mui/material";
import { FaCalendarAlt } from "react-icons/fa";
import { FiDownload, FiFilter } from "react-icons/fi";
import { FaRegFileExcel } from "react-icons/fa6";
import { AiOutlineConsoleSql } from "react-icons/ai";

// SalesReportTable component to display the sales report
const SalesReportTable = ({ reportData }) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="sales report table">
        <TableHead>
          <TableRow>
            <TableCell />

            <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
              Product Id
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
              Product Name
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
              Product Brand
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
              Quantity
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
              Revenue
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reportData?.topProducts?.map((report, index) => (
            <TableRow key={index}>
              <TableCell padding="checkbox"></TableCell>

              <TableCell>{report?._id}</TableCell>
              <TableCell component="th" scope="row">
                <div className="flex items-center">
                  <img
                    src={report?.thumbnail[0]}
                    alt="product"
                    className="w-10 h-10 mr-3 object-cover"
                  />
                  {report?.productName}
                </div>
              </TableCell>
              <TableCell>{report?.productBrand}</TableCell>
              <TableCell>
                {report?.totalQuantity} x {report?.price}
              </TableCell>
              <TableCell>
                <FaRupeeSign className="inline" /> {report?.totalRevenue}
              </TableCell>
            </TableRow>
          ))}

          <TableRow>
            <TableCell colSpan={5} sx={{ borderBottom: "none" }} />
            <TableCell
              sx={{
                borderBottom: "none",
                whiteSpace: "nowrap",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              Total Quantity
            </TableCell>
            <TableCell
              sx={{
                borderBottom: "none",
                whiteSpace: "nowrap",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              Total Revenue
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={5} sx={{ borderBottom: "none" }} />
            <TableCell
              sx={{
                borderBottom: "none",
                whiteSpace: "nowrap",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              {reportData?.topProductsSummary?.totalQuantity}
            </TableCell>
            <TableCell
              sx={{
                borderBottom: "none",
                whiteSpace: "nowrap",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              <FaRupeeSign className="inline" />{" "}
              {reportData?.topProductsSummary?.totalRevenue}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const SalesReport = () => {
  const location = useLocation();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filter, setFilter] = useState("Daily");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);
    fetchReport(selectedFilter); // Fetch report when filter changes
  };

  const fetchReport = async (selectedFilter = filter, start = fromDate, end = toDate) => {
    setLoading(true); // Start loading
    setError(null); // Clear previous error
    try {
      let params = {};
      if (selectedFilter) {
        params.filter = selectedFilter;
      }
      if (start && end) {
        params.fromDate = start;
        params.toDate = end;
      }

      const response = await api.get("admin/salesreport", { params });
      setReportData(response.data);
    } catch (error) {
      console.log("Error fetching sales report:", error);
      setError("Failed to fetch sales report. Please try again.");
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleCustomDateSubmit = () => {
    if (!fromDate || !toDate) {
      setError("Please select both start and end dates.");
      return;
    }
  
    const currentDate = new Date().toISOString().split("T")[0];
    
    if (fromDate > currentDate || toDate > currentDate) {
      setError("Selected dates cannot be in the future.");
      return;
    }
  
    fetchReport(null, fromDate, toDate); 
    setError(null); 
  };
  

  useEffect(() => {
    fetchReport("Daily"); 
  }, []);

  const handleDownloadSalesReport = async (format) => {
    try {
      let params = {};
      if (fromDate && toDate) {
      console.log(fromDate,toDate)
        params.fromDate = fromDate;
        params.toDate = toDate;
      } else {
        params.filter = filter;
      }
      params.format = format;

      const response = await api.get("admin/reportdownload", {
        params,
        responseType: "blob",
      });

      const contentType = response.headers["content-type"];
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const reader = new FileReader();
        reader.onload = function () {
          const errorMessage = JSON.parse(reader.result);
          console.error("Server error:", errorMessage);
          alert(
            `Error: ${errorMessage.message || "Failed to download report"}`
          );
        };
        reader.readAsText(response.data);
        return;
      }

      const blob = new Blob([response.data], {
        type:
          format === "pdf"
            ? "application/pdf"
            : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `sales_report.${format === "pdf" ? "pdf" : "xlsx"}`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log("Download error:", error);
      setError("Failed to download the report. Please try again.");
    }
  };

  return (
    <div className="py-16">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="flex items-center justify-between w-40 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm">
            <FiFilter className="text-blue-600 mr-1" />
            <select
              value={filter}
              className="outline-none"
              onChange={handleFilterChange}
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </button>

          <div className="flex items-center">
            <FaCalendarAlt className="mr-2" />
            <TextField
              label="From"
              type="date"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              size="small"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              sx={{ backgroundColor: "white", borderRadius: "4px" }}
            />
          </div>

          <div className="flex items-center">
            <FaCalendarAlt className="mr-2" />
            <TextField
              label="To"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              size="small"
              sx={{ backgroundColor: "white", borderRadius: "4px" }}
            />
          </div>

          <button
            className="bg-black text-white font-semibold px-3 py-2 border-none rounded-md"
            onClick={handleCustomDateSubmit}
          >
            Submit
          </button>
        </div>

        <div className="flex space-x-4">
          <button
            className="flex items-center justify-center w-14 h-10 bg-black rounded-md"
            onClick={() => handleDownloadSalesReport("pdf")}
          >
            <FiDownload className="text-white text-2xl" />
          </button>
          <button
            className="flex items-center justify-center w-14 h-10 bg-black rounded-md"
            onClick={() => handleDownloadSalesReport("xlsx")}
          >
            <FaRegFileExcel className="text-white text-2xl" />
          </button>
        </div>
      </div>
      {loading && <p>Loading...</p>} {/* Loading indicator */}
      {error && <p className="text-red-500">{error}</p>} {/* Error message */}
      <div className="mt-10">
        {reportData ? (
          <SalesReportTable reportData={reportData} />
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  );
};

export default SalesReport;