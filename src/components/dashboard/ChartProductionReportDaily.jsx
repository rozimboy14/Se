import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

// ChartJS komponentlarini ro‘yxatga olish
ChartJS.register(
    CategoryScale,  // X o'qi uchun
    LinearScale,    // Y o'qi uchun
    BarElement,     // Bar chart uchun
    Title,
    Tooltip,
    Legend
);
import { getChartProductionReportDaily } from "../api/axios";


function ChartProductionReportDaily() {

    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    useEffect(() => {
        getChartProductionReportDaily(2, 2025, "10")
            .then(res => {
                const data = res.data;
                setChartData({
                    labels: data.dates,
                    datasets: [
                        {
                            label: "Total Quantity (Sort1 + Sort2)",
                            data: data.total_quantity,
                            backgroundColor: "rgba(75,192,192,0.7)"
                        },
                        {
                            label: "Defects",
                            data: data.defects,
                            backgroundColor: "rgba(255,99,132,0.7)"
                        }
                    ]
                });
            })
            .catch(err => console.error(err));
    }, [2, 2025, "09"]);

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Daily Production (Bar Chart)' }
        },
        scales: {
            y: { beginAtZero: true }
        }
    };

    return <Bar data={chartData} options={options} />;
};

export default ChartProductionReportDaily;
