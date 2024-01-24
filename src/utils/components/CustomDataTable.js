import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { blue, yellow } from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import { EntitiesListResponseModelShape } from "../models/EntitiesListResponseModel";

const EditToolbar = (props) => {
  const {
    addRecordButtonTitle,
    canBeDeleted,
    lunchCreateModal,
    lunchDeletionModal,
    selectedRows,
    tableTitle,
  } = props;

  return (
    <GridToolbarContainer
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginY: 2,
      }}
    >
      <Typography
        sx={{ flex: 1, textTransform: "uppercase", color: blue[600] }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        {tableTitle}
      </Typography>
      <div>
        <Button
          color="primary"
          startIcon={<AddIcon />}
          onClick={lunchCreateModal}
        >
          {addRecordButtonTitle}
        </Button>
        {selectedRows?.length > 0 && canBeDeleted && (
          <Button
            color="secondary"
            startIcon={<DeleteIcon />}
            onClick={() => lunchDeletionModal(selectedRows)}
            sx={{ ml: 1 }}
          >
            Delete selected
          </Button>
        )}
      </div>
    </GridToolbarContainer>
  );
};

EditToolbar.propTypes = {
  addRecordButtonTitle: PropTypes.string.isRequired,
  canBeDeleted: PropTypes.bool,
  lunchCreateModal: PropTypes.func.isRequired,
  lunchDeletionModal: PropTypes.func,
  selectedRows: PropTypes.array.isRequired,
  tableTitle: PropTypes.string.isRequired,
};

const CustomDataTable = (props) => {
  const {
    addRecordButtonTitle,
    canBeDeleted = true,
    headerColumn,
    lunchCreateModal,
    lunchDeletionModal,
    paginationModel,
    rows,
    setPaginationModel,
    tableTitle,
  } = props;
  const [selectedRows, setSelectedRows] = useState([]);

  return (
    <div
      style={{
        height: rows?.content.length >= 5 ? "100%" : 440,
        width: "100%",
      }}
    >
      <DataGrid
        rows={rows.content}
        columns={headerColumn}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10, 20, 50, 100]}
        rowCount={rows.totalElements}
        paginationModel={paginationModel}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
        checkboxSelection
        disableRowSelectionOnClick
        keepNonExistentRowsSelected
        onRowSelectionModelChange={(newSelectionModel) => {
          setSelectedRows(newSelectionModel);
        }}
        slots={{
          toolbar: () => (
            <EditToolbar
              addRecordButtonTitle={addRecordButtonTitle}
              canBeDeleted={canBeDeleted}
              lunchCreateModal={lunchCreateModal}
              lunchDeletionModal={lunchDeletionModal}
              selectedRows={selectedRows}
              tableTitle={tableTitle}
            />
          ),
        }}
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: yellow[800],
          },
        }}
      />
    </div>
  );
};

CustomDataTable.propTypes = {
  addRecordButtonTitle: PropTypes.string.isRequired,
  canBeDeleted: PropTypes.bool,
  headerColumn: PropTypes.array.isRequired,
  lunchCreateModal: PropTypes.func.isRequired,
  lunchDeletionModal: PropTypes.func,
  paginationModel: PropTypes.object.isRequired,
  rows: EntitiesListResponseModelShape.isRequired,
  setPaginationModel: PropTypes.func.isRequired,
  tableTitle: PropTypes.string.isRequired,
};

export default CustomDataTable;
