import React from "react";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
//import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
//import LineChart from "../../components/LineChart";
//import GeographyChart from "../../components/GeographyChart";
//import BarChart from "../../components/BarChart";
import StatBox from "../../utils/components/StatBox";
//import ProgressCircle from "../../utils/components/ProgressCircle";
import { mockTransactions } from "../../utils/models/data";
import DasboardHeader from "../header/DasboardHeader";

const Dashboard = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	return (
		<Box m="20px" sx={{ width: "97%", marginTop: "4.5rem" }}>
			{/* HEADER */}
			<Box display="flex" justifyContent="space-between" alignItems="center">
				<DasboardHeader
					title="DASHBOARD"
					subtitle="Welcome to your dashboard"
				/>

				<Box>
					<Button
						sx={{
							backgroundColor: colors.blueAccent[700],
							color: colors.grey[100],
							fontSize: "14px",
							fontWeight: "bold",
							padding: "10px 20px",
							borderRadius: "3px",
						}}
					>
						<DownloadOutlinedIcon sx={{ mr: "10px" }} />
						Download Reports
					</Button>
				</Box>
			</Box>

			{/* GRID & CHARTS */}
			<Box
				display="grid"
				gridTemplateColumns="repeat(12, 1fr)"
				gridAutoRows="140px"
				gap="20px"
			>
				{/* ROW 1 */}
				<Box
					gridColumn="span 3"
					backgroundColor={colors.primary[400]}
					display="flex"
					alignItems="center"
					justifyContent="center"
					borderRadius="4px"
				>
					<StatBox
						title="12,361"
						subtitle="Emails Sent"
						progress="0.75"
						increase="+14%"
						icon={
							<EmailIcon
								sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
							/>
						}
					/>
				</Box>

				<Box
					gridColumn="span 3"
					backgroundColor={colors.primary[400]}
					display="flex"
					alignItems="center"
					justifyContent="center"
					borderRadius="4px"
				>
					<StatBox
						title="431,225"
						subtitle="Sales Obtained"
						progress="0.50"
						increase="+21%"
						icon={
							<PointOfSaleIcon
								sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
							/>
						}
					/>
				</Box>

				<Box
					gridColumn="span 3"
					backgroundColor={colors.primary[400]}
					display="flex"
					alignItems="center"
					justifyContent="center"
					borderRadius="4px"
				>
					<StatBox
						title="32,441"
						subtitle="New Clients"
						progress="0.30"
						increase="+5%"
						icon={
							<PersonAddIcon
								sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
							/>
						}
					/>
				</Box>

				<Box
					gridColumn="span 3"
					backgroundColor={colors.primary[400]}
					display="flex"
					alignItems="center"
					justifyContent="center"
					borderRadius="4px"
				>
					<StatBox
						title="1,325,134"
						subtitle="Traffic Received"
						progress="0.80"
						increase="+43%"
						icon={
							<TrafficIcon
								sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
							/>
						}
					/>
				</Box>

				{/* ROW 2 */}
				<Box
					gridColumn="span 8"
					gridRow="span 2"
					backgroundColor={colors.primary[400]}
					borderRadius="4px"
				>
					<Box
						mt="25px"
						p="0 30px"
						display="flex "
						justifyContent="space-between"
						alignItems="center"
					>
						<Box>
							<Typography
								variant="h5"
								fontWeight="600"
								color={colors.grey[100]}
							>
								Revenue Generated
							</Typography>
							<Typography
								variant="h3"
								fontWeight="bold"
								color={colors.greenAccent[500]}
							>
								$59,342.32
							</Typography>
						</Box>
						<Box>
							<IconButton>
								<DownloadOutlinedIcon
									sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
								/>
							</IconButton>
						</Box>
					</Box>
					<Box height="250px" m="-20px 0 0 0">
						{/*<LineChart isDashboard={true} />*/}
					</Box>
				</Box>
				<Box
					gridColumn="span 4"
					gridRow="span 2"
					backgroundColor={colors.primary[400]}
					overflow="auto"
					borderRadius="4px"
				>
					<Box
						display="flex"
						justifyContent="space-between"
						alignItems="center"
						borderBottom={`4px solid ${colors.primary[500]}`}
						colors={colors.grey[100]}
						p="15px"
					>
						<Typography color={colors.grey[100]} variant="h5" fontWeight="600">
							Recent Transactions
						</Typography>
					</Box>
					{mockTransactions.map((transaction, i) => (
						<Box
							key={`${transaction.txId}-${i}`}
							display="flex"
							justifyContent="space-between"
							alignItems="center"
							borderBottom={`4px solid ${colors.primary[500]}`}
							p="15px"
						>
							<Box>
								<Typography
									color={colors.greenAccent[500]}
									variant="h5"
									fontWeight="600"
								>
									{transaction.txId}
								</Typography>
								<Typography color={colors.grey[100]}>
									{transaction.user}
								</Typography>
							</Box>
							<Box color={colors.grey[100]}>{transaction.date}</Box>
							<Box
								backgroundColor={colors.greenAccent[500]}
								p="5px 10px"
								borderRadius="4px"
							>
								${transaction.cost}
							</Box>
						</Box>
					))}
				</Box>
			</Box>
		</Box>
	);
};

export default Dashboard;
