import React, { useState } from "react";
import { Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { exportPdf } from "../api/axios";

function Barcode() {
    const [loading, setLoading] = useState(false);

    const handleExport = async (file) => {
        try {
            setLoading(true);

            // Excel faylni serverga yuboramiz
            const response = await exportPdf(file);

            // Backenddan PDF qaytadi (blob formatda)
            const url = window.URL.createObjectURL(
                new Blob([response.data], { type: "application/pdf" })
            );

            // PDF-ni avtomatik yuklab olish
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "barcodes.pdf");
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Xatolik:", error);
            alert("Faylni yuklashda xatolik yuz berdi!");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            handleExport(e.target.files[0]);
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <input
                type="file"
                accept=".xlsx,.xls"
                id="excel-upload"
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
            <label htmlFor="excel-upload">
                <Button
                    variant="contained"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    disabled={loading}
                >
                    {loading ? "Yuklanmoqda..." : "Excel yuklab, PDF yaratish"}
                </Button>
            </label>
        </div>
    );
}

export default Barcode;
