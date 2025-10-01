import { Box, Typography } from "@mui/material";

export default function CalendarIcon({ day }) {
    return (
        <Box
            sx={{
                width: "90%",
                height: 160,
                borderRadius: "10px",
                backgroundColor: "white",
                color: "white",
                gap: "5px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                fontWeight: "bold",



                boxShadow: "0px 6px 6px 0px rgba(0,0,0,0.5)",
            }}
        >
            <Box sx={{
                width: "100%",
                height: "20%",
                borderTopLeftRadius: "9px",
                borderTopRightRadius: "9px",
              background: "#243748",
                color: "white",
                display: "flex",
                position: "relative",
  boxShadow: "0px 2px 10px rgba(0,0,0,0.3)",
                fontWeight: "bold",


            }} >


                {/* Ilmoqlar */}
                <Box
                    sx={{
                        position: "absolute",
                        top: "-8px",
                        left: "17px",
                        width: "2px",
                        height: "20px",
                        backgroundColor: "black",
                        borderRadius: "80px",
                        zIndex: "15"
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        top: "-8px",
                        left: "22px",
                        width: "2px",
                        height: "20px",
                        backgroundColor: "black",
                        borderRadius: "80px",
                        zIndex: "15"
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        top: "-8px",
                        left: "38px",
                        width: "2px",
                        height: "20px",
                        backgroundColor: "black",
                        borderRadius: "80px",
                        zIndex: "15"
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        top: "-8px",
                        left: "43px",
                        width: "2px",
                        height: "20px",
                        backgroundColor: "black",
                        borderRadius: "80px",
                        zIndex: "15"
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        top: "-8px",
                        left: "61px",
                        width: "2px",
                        height: "20px",
                        backgroundColor: "black",
                        borderRadius: "80px",
                        zIndex: "15"
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        top: "-8px",
                        left: "66px",
                        width: "2px",
                        height: "20px",
                        backgroundColor: "black",
                        borderRadius: "80px",
                        zIndex: "15"
                    }}
                />

                <Box
                    sx={{
                        position: "absolute",
                        top: "-8px",
                        left: "85px",
                        width: "2px",
                        height: "20px",
                        backgroundColor: "black",
                        borderRadius: "80px",
                        zIndex: "15"
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        top: "-8px",
                        left: "90px",
                        width: "2px",
                        height: "20px",
                        backgroundColor: "black",
                        borderRadius: "80px",
                        zIndex: "15"
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        top: "-8px",
                        left: "110px",
                        width: "2px",
                        height: "20px",
                        backgroundColor: "black",
                        borderRadius: "80px",
                        zIndex: "15"
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        top: "-8px",
                        left: "115px",
                        width: "2px",
                        height: "20px",
                        backgroundColor: "black",
                        borderRadius: "80px",
                        zIndex: "15"
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        top: "-8px",
                        left: "134px",
                        width: "2px",
                        height: "20px",
                        backgroundColor: "black",
                        borderRadius: "80px",
                        zIndex: "15"
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        top: "-8px",
                        left: "139px",
                        width: "2px",
                        height: "20px",
                        backgroundColor: "black",
                        borderRadius: "80px",
                        zIndex: "15"
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        top: "5px",
                        left: "13px",
                        width: "14px",
                        height: "14px",
                        backgroundColor: "#fff",
                        borderRadius: "50%",
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        top: "5px",
                        left: "34px",
                        width: "14px",
                        height: "14px",
                        backgroundColor: "#fff",
                        borderRadius: "50%",
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        top: "5px",
                        left: "57px",
                        width: "14px",
                        height: "14px",
                        backgroundColor: "#fff",
                        borderRadius: "50%",
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        top: "5px",
                        left: "81px",
                        width: "14px",
                        height: "14px",
                        backgroundColor: "#fff",
                        borderRadius: "50%",
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        top: "5px",
                        left: "106px",
                        width: "14px",
                        height: "14px",
                        backgroundColor: "#fff",
                        borderRadius: "50%",
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        top: "5px",
                        left: "130px",
                        width: "14px",
                        height: "14px",
                        backgroundColor: "#fff",
                        borderRadius: "50%",
                    }}
                />

            </Box>
            <Box sx={{
                width: "100%",
                height: "80%",
                      backgroundColor: day >= 5 ? "#51c26f" :"#e01f2d",
                color: "white",
                borderBottomLeftRadius: "9px",
                borderBottomRightRadius: "9px",




            }}>
                <Typography sx={{ fontSize: "75px", fontWeight: "600", lineHeight: "1",marginTop:"5px" }}>
                    {day ?? 0}
                </Typography>

                {/* Katta raqam */}



                {day && (
                    <Typography sx={{ fontSize: "16px", fontWeight: "normal" }}>
                        ish kuni
                    </Typography>
                )}
            </Box>
        </Box>
    );
}
