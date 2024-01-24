import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Modal from "react-modal";
import styles from "./FormModal.module.css";
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";
import FullscreenOutlinedIcon from "@mui/icons-material/FullscreenOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";

const customStyles = {
	content: {
		top: "50%",
		left: "50%",
		right: "20%",
		bottom: "-15%",
		borderRadius: "9px",
		marginRight: "-30%",
		paddingRight: "0%",
		paddingTop: "0%",
		outerWidth: "10%",
		innerWidth: "10%",
		transform: "translate(-50%, -50%)",
	},
};

const customStylesFullScreen = {
	content: {
		top: "54%",
		left: "50%",
		right: "2.5%",
		bottom: "-42%",
		borderRadius: "9px",
		marginRight: "-50%",
		paddingRight: "0%",
		paddingTop: "0%",
		outerWidth: "10%",
		innerWidth: "10%",
		transform: "translate(-50%, -50%)",
	},
};

Modal.setAppElement("#root");

const FormModal = (props) => {
	const {
		handleCloseModal,
		title,
		children,
		requestHandler,
		showGoBackButton,
		showModal,
		fullScreen,
		setFullScreen,
		renderingDivId,
	} = props;

	return ReactDOM.createPortal(
		<Modal
			id="custom-modal"
			isOpen={showModal}
			contentLabel="Custom Modal"
			onRequestClose={handleCloseModal}
			overlayClassName={styles["overlay"]}
			style={fullScreen ? customStylesFullScreen : customStyles}
			shouldCloseOnOverlayClick={false}
		>
			<div className={styles["close"]}>
				<IconButton
					onClick={handleCloseModal}
					style={{ float: "right", padding: "5px 8px 5px 3px" }}
				>
					<CancelIcon fontSize="small" />
				</IconButton>
				<IconButton
					onClick={setFullScreen}
					style={{ float: "right", padding: "5px 3px 5px 5px" }}
				>
					{fullScreen ? (
						<FullscreenExitOutlinedIcon fontSize="small" />
					) : (
						<FullscreenOutlinedIcon fontSize="small" />
					)}
				</IconButton>
			</div>
			<div className={styles["header"]}>
				<h3>{title}</h3>
			</div>
			<form className={styles["container"]}>
				<div>{children}</div>
				<br />
				<footer>
					{showGoBackButton ? (
						<button
							className={styles["go-back-button"]}
							onClick={handleCloseModal}
						>
							Go Back
						</button>
					) : (
						<>
							<button
								className={styles["cancel-button"]}
								onClick={handleCloseModal}
							>
								Cancel
							</button>
							<button
								type="submit"
								className={styles["action-button"]}
								onClick={requestHandler}
							>
								Submit
							</button>
						</>
					)}
				</footer>
			</form>
		</Modal>,
		document.getElementById(renderingDivId)
	);
};

FormModal.propTypes = {
  handleCloseModal: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  requestHandler: PropTypes.func.isRequired,
  showGoBackButton: PropTypes.bool.isRequired,
  showModal: PropTypes.bool.isRequired,
  fullScreen: PropTypes.bool.isRequired,
  setFullScreen: PropTypes.func.isRequired,
  renderingDivId: PropTypes.string.isRequired,
};

export default FormModal;
