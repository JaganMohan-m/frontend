import React, { PureComponent, forwardRef } from "react";
import MaterialTable from "material-table";
// import axios from "axios";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import * as XLSX from "xlsx";
import { SheetJSFT } from "./utils/types";
import { make_cols } from "./utils/makeColumns";
import {
  Grid,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Card,
  Button,
  Input,
  ListItemText,
  Checkbox,
  Typography,
  Hidden,
  Fab,
} from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { getTenantId } from "egov-ui-framework/ui-utils/localStorageUtils";
import AddBox from "@material-ui/icons/AddBox";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import { connect } from "react-redux";

const tableIcons = {
  Add: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
    <AddBox {...props} ref={ref} />
  )),
  Check: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
    <Check {...props} ref={ref} />
  )),
  Clear: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
    <Clear {...props} ref={ref} />
  )),
  Delete: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
    <DeleteOutline {...props} ref={ref} />
  )),
  DetailPanel: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
    <Edit {...props} ref={ref} />
  )),
  Export: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
    <SaveAlt {...props} ref={ref} />
  )),
  Filter: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
    <FilterList {...props} ref={ref} />
  )),
  FirstPage: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
    <FirstPage {...props} ref={ref} />
  )),
  LastPage: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
    <LastPage {...props} ref={ref} />
  )),
  NextPage: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
    <ChevronRight {...props} ref={ref} />
  )),
  PreviousPage: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
    <Clear {...props} ref={ref} />
  )),
  Search: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
    <Search {...props} ref={ref} />
  )),
  SortArrow: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
    <ArrowUpward {...props} ref={ref} />
  )),
  ThirdStateCheck: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
    <Remove {...props} ref={ref} />
  )),
  ViewColumn: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
    <ViewColumn {...props} ref={ref} />
  )),
};

class ApiTable extends PureComponent {
  state = {
    datas: {},
    id: 0,
    newData: {},
    // data: [],
    isFileSelected: true,
    selectedState: "",
    name: [],
    multiSelect: [],
    locale: [],

    newSearch: [],

    apidata: [],
    statelocale: [],
    statemultiSelect: [],

    file: {},
    data: [],
    cols: [],
    validate: "",
    matchData: [],
    allData:[]
  };

  componentDidMount = async () => {
    // var c = new URL(window.location.href).searchParams.get("module");
    var mod = new URL(window.location.href).searchParams.get("module");
    var module = mod ? mod.split(",") : [];
    var loc = new URL(window.location.href).searchParams.get("locale");
    var locale = loc ? loc.split(",") : [];
    var tenantId = new URL(window.location.href).searchParams.get("tenantId");
    console.log(module, "module");

    console.log(this.state, "state");
    if (locale.length >= 1 && module.length >= 1) {
      var statemultiSelect = [];
      statemultiSelect = module.map((m) => {
        return { label: m, value: m };
      });

      console.log("not axios");
      this.setState({
        ...this.state,
        statemultiSelect,
        selectedState: new URL(window.location.href).searchParams.get(
          "tenantId"
        ),
        multiSelect: module,
        statelocale: locale.map((m) => {
          return { label: m, value: m };
        }),
        locale: locale,
      });
    } else {
      console.log("axios");
      const requestbody = {
        MdmsCriteria: {
          tenantId: getTenantId().split(".")[0],
          moduleDetails: [
            {
              moduleName: "common-masters",
              masterDetails: [
                {
                  name: "StateInfo",
                },
              ],
            },
          ],
        },
      };
      try {
        const payload = await httpRequest(
          "post",
          `egov-mdms-service/v1/_search?tenantId=${
            tenantId ? tenantId : getTenantId()
          }`,
          "_search",
          [],
          requestbody
        );
        this.setState({
          ...this.state,
          apidata: payload.MdmsRes["common-masters"],
          selectedState: tenantId ? tenantId : getTenantId(),
          statelocale: payload.MdmsRes["common-masters"].StateInfo[0].languages,
          statemultiSelect:
            payload.MdmsRes["common-masters"].StateInfo[0].localizationModules,
        });
        this.onSearch(true);
      } catch (e) {
        console.log(e);
      } finally {
      }
    }
  };

  // saveData = data => {
  //   this.setState({ ...this.state, data: data })
  // };

  onCreate = async (isBulk=false,data=[]) => {
    const { newData } = this.state;
    const { onSearch } = this;
    let requestbody={locale: newData.locale,
    tenantId: getTenantId().split(".")[0]}
    if (!isBulk) {
      requestbody["messages"]= [
          {
            code: newData.code,
            message: newData.message,
            module: newData.module,
            locale: newData.locale,
          },
        ]
    }
    else {
      requestbody["messages"]=data;
    }


    try {
      await httpRequest(
        "post",
        `localization/messages/v1/_create`,
        "_create",
        [],
        requestbody
      );
      this.setState({
        data: "",
      });
      if (!isBulk) {
        this.props.toggleSnackbar(
          {
            labelName: "Localization key added successfully!",
            labelKey: "SUCCESS_COMMON_ADD_LOCALISATION_KEY",
          },
          "success"
        );
      } else {
        this.props.toggleSnackbar(
          {
            labelName: "Localization keys added successfully!",
            labelKey: "SUCCESS_COMMON_ADD_LOCALISATION_KEYS",
          },
          "success"
        );
      }

      onSearch();
    } catch (e) {
      console.log(e);
      this.errorHandler();
    }
  };

  errorHandler = () => {
    this.props.toggleSnackbar(
      {
        labelName: "Somthing went wrong!",
        labelKey: "ERR_COMMON_SOMTHING_WENT_WRONG",
      },
      "error"
    );
  };

  onUpdate = async (id) => {
    const { datas } = this.state;
    const { onSearch } = this;
    const requestbody = {
      locale: datas.locale,
      module: datas.module,
      tenantId: getTenantId().split(".")[0],
      messages: [
        {
          code: datas.code,
          message: datas.message,
          module: datas.module,
          locale: datas.locale,
        },
      ],
    };
    try {
      await httpRequest(
        "post",
        `localization/messages/v1/_update`,
        "_update",
        [],
        requestbody
      );
      this.setState({
        data: "",
      });
      this.props.toggleSnackbar(
        {
          labelName: "Localization key updated successfully!",
          labelKey: "SUCCESS_COMMON_UPDATE_LOCALISATION_KEY",
        },
        "success"
      );
      onSearch();
    } catch (e) {
      this.errorHandler();
      console.log(e);
    } finally {
    }
  };

  onDelete = async (id) => {
    const requestbody = {
      locale: this.state.datas.locale,
      tenantId: getTenantId().split(".")[0],
      messages: [
        {
          code: this.state.newData.code,
          message: this.state.newData.message,
          module: this.state.newData.module,
          locale: this.state.newData.locale,
        },
      ],
    };
    try {
      await httpRequest(
        "post",
        `localization/messages/v1/_delete`,
        "_delete",
        [],
        requestbody
      );
      this.setState({
        data: "",
      });
      this.props.toggleSnackbar(
        {
          labelName: "Localization key deleted successfully!",
          labelKey: "SUCCESS_COMMON_DELETED_LOCALISATION_KEY",
        },
        "success"
      );
      this.onSearch();
    } catch (e) {
      console.log(e);
      this.errorHandler();
    }
  };

  onSearch = async (isFirstTime=false) => {
    if (!isFirstTime) {
      const module =
        this.state.multiSelect.length > 0
          ? this.state.multiSelect.join(",")
          : "module=rainmaker-pgr,rainmaker-pt,rainmaker-tl,finance-erp,rainmaker-common,rainmaker-hr,rainmaker-uc,rainmaker-noc,rainmaker-dss";
      const locale = this.state.locale.length > 0 ? this.state.locale : "en_IN";
      const tenantId = this.state.selectedState
        ? this.state.selectedState.split(".")[0]
        : getTenantId().split(".")[0];
      try {
        const payload = await httpRequest(
          "post",
          `localization/messages/v1/_search?module=${module}&locale=${locale}&tenantId=${tenantId}`,
          "_search"
        );
        this.setState({ ...this.state, newSearch: payload.messages });
      } catch (e) {
        console.log(e);
      } finally {
      }
    }
    else {
      const module =
        this.state.multiSelect.length > 0
          ? this.state.multiSelect.join(",")
          : "module=rainmaker-pgr,rainmaker-pt,rainmaker-tl,finance-erp,rainmaker-common,rainmaker-hr,rainmaker-uc,rainmaker-noc,rainmaker-dss";
      const locale = "en_IN";
      const tenantId = getTenantId().split(".")[0];
      try {
        const payload = await httpRequest(
          "post",
          `localization/messages/v1/_search?module=${module}&locale=${locale}&tenantId=${tenantId}`,
          "_search"
        );
        this.setState({ ...this.state, allData: payload.messages,newSearch: payload.messages  });
      } catch (e) {
        console.log(e);
      } finally {
      }
    }

  };


  onReset = () => {
    this.setState({
      ...this.state,
      multiSelect: [],
      locale: [],
    });
  };

  handleChange = (event) => {
    this.setState({ selectedState: event.target.value });
  };

  handleChangeLocale = (event) => {
    this.setState({ locale: event.target.value });
  };

  handleChangeExcel = (e) => {
    const { handleFile } = this;
    const files = e.target.files;
    console.log(files, "files");
    if (files && files[0]) {
      this.setState({ file: files[0], isFileSelected: false }, () => {
        handleFile();
      });
    }
  };

  handleChangeMulti = (event) => {
    console.log(event.target.value, "event");
    this.setState({ multiSelect: event.target.value });
  };

  handleChangeMultiple = (event) => {
    const { options } = event.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    // multiSelect(value);
    this.setState({
      multiSelect: value,
    });
  };

  handleFile = () => {
    const { handleValidateUpload } = this;

    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, {
        type: rABS ? "binary" : "array",
        bookVBA: true,
      });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws);
      /* Update state */
      this.setState({ data: data, cols: make_cols(ws["!ref"]) }, () => {
        // console.log(JSON.stringify(this.state.data, null, 2));
        handleValidateUpload();
      });
    };
    if (rABS) {
      reader.readAsBinaryString(this.state.file);
    } else {
      reader.readAsArrayBuffer(this.state.file);
    }
  };

  handleValidateUpload = () => {
    var TotallenOfObj = this.state.data.reduce(
      (a, obj) => a + Object.keys(obj).length,
      0
    );
    var lenOfObj = this.state.data.reduce(
      (a, obj) => Object.keys(obj).length,
      0
    );
    var lenOfArr = this.state.data.length * 4;
    console.log(lenOfObj, "data", TotallenOfObj, lenOfArr);
    if (TotallenOfObj === lenOfArr && lenOfObj === 4) {
      console.log("correct data");
      this.setState({ validate: "" });
    } else {
      console.log("Invalid data");
      this.setState({ validate: "Please check excel sheet cells" });
    }
  };

  cmpreUpload = (excelData=[]) => {
    // const {allData=[]}=this.state;
    // let matchData=[];
    // excelData.forEach((s1, k1) => {
    //   let matchFound = false;
    //
    //   allData.forEach((e1, k2) => {
    //     if (
    //       s1.Code === e1.code &&
    //       s1.Module === e1.module &&
    //       s1.Message === e1.message
    //     ) {
    //       matchFound = true;
    //     }
    //     // } else {
    //     //   matchData.push(s1)
    //     //   console.log(matchData,"matchData")
    //     // }
    //   });
    //   if (!matchFound) {
    //     // let { matchData = [] } = this.state;
    //     matchData.push(s1);
    //     // this.setState({ matchData },
    //       // console.log("s1", this.state.matchData));
    //   }
    // });
    // if (matchData.length>0) {
    //   this.onCreate(true,matchData)
    // }
    console.log(excelData);
    this.onCreate(true,excelData)
  };

  render() {
    // console.log("matchData", this.state.matchData);

    const { data = [], newSearch = [], isFileSelected } = this.state;
    let filterModule = [];
    let filterLocale = [];

    newSearch !== [] &&
      newSearch.forEach((da, key) => {
        filterModule.push(da.module);
      });

    let filtermoduleUnique = {};
    var filterMooduleuniqueSearch = filterModule.filter(
      (v, i, a) => a.indexOf(v) === i
    );
    filterMooduleuniqueSearch.forEach((u, i) => {
      filtermoduleUnique[u] = u;
    });

    newSearch !== [] &&
      newSearch.forEach((da, key) => {
        filterLocale.push(da.locale);
      });

    let filterLocaleUnique = {};
    var filterLocaleuniqueSearch = filterLocale.filter(
      (v, i, a) => a.indexOf(v) === i
    );
    filterLocaleuniqueSearch.forEach((u, i) => {
      filterLocaleUnique[u] = u;
    });

    const columns = [
      { title: getLocaleLabels("Code", "LC_CODE_KEY"), field: "code" },
      { title: getLocaleLabels("Message", "LC_MESSAGE_KEY"), field: "message" },
      {
        title: getLocaleLabels("Module", "LC_MODULE_KEY"),
        field: "module",
        lookup: filtermoduleUnique,
      },
      {
        title: getLocaleLabels("Locale", "LC_LOCALE_KEY"),
        field: "locale",
        lookup: filterLocaleUnique,
      },
    ];

    const enabled = this.state.locale.length >= 1;

    return (
      <div>
        <Grid container justify="center" alignItems="center">
          <Grid container item md={5} sm={6} xs={11}>
            <Typography variant="h4" style={{ margin: "1em 0em" }}>
              {getLocaleLabels("Search localization", "LC_MAIN_HEADER")}
            </Typography>
          </Grid>

          <Grid
            item
            md={6}
            sm={6}
            xs={11}
            container
            direction="row"
            justify="flex-end"
          >
            <input
              style={{ display: "none" }}
              // accept="file"
              id="outlined-button-file"
              multiple
              type="file"
              accept={SheetJSFT}
              onChange={this.handleChangeExcel}
            />
            <label htmlFor="outlined-button-file">
              <Fab
                color="primary"
                size="small"
                aria-label="Add"
                component="span"
                style={{ background: "#fe7a51", color: "#fff" }}
              >
                <AddIcon />
              </Fab>
            </label>
            <span style={{ padding: "8px" }}>{this.state.file.name} </span>
            {/* </Grid> */}

            {/* <Grid item md={4} sm={4} xs={11}> */}

            <Button
              variant="contained"
              disabled={isFileSelected}
              onClick={() => this.cmpreUpload(data)}
              // style={{ background: "#fe7a51", color: "#fff" }}
            >
              {" "}
              {getLocaleLabels("Upload", "LC_UPLOAD_KEY")}
            </Button>

            <br />
            <Grid
              container
              direction="row"
              justify="flex-end"
              alignItems="center"
            >
              <span style={{ color: "red" }}>&nbsp;{this.state.validate}</span>
            </Grid>
          </Grid>
        </Grid>
        <Grid container justify="center" alignItems="center">
          <Grid item md={11} sm={11} xs={11}>
            <Card style={{ marginBottom: "2rem" }}>
              <Typography variant="h5" style={{ margin: "1em" }}>
                {getLocaleLabels(
                  "Search For Localization",
                  "LC_SEARCH_FOR_LOCALIZATION"
                )}
              </Typography>

              <Grid container style={{ margin: "2rem" }}>
                <Grid item md={4} sm={6} xs={10}>
                  <FormControl style={{ width: "70%" }}>
                    <InputLabel>
                      {getLocaleLabels("Tenant Id", "LC_TENANT_ID")}
                    </InputLabel>
                    <Select
                      open={this.state.open}
                      onClose={this.handleClose}
                      onOpen={this.handleOpen}
                      value={this.state.selectedState}
                      onChange={this.handleChange}
                      disabled
                    >
                      <MenuItem value={this.state.selectedState}>
                        {this.state.selectedState}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item md={4} sm={6} xs={10}>
                  <FormControl style={{ width: "70%" }}>
                    <InputLabel htmlFor="select-multiple">
                      {getLocaleLabels("Module", "LC_MODULE_TYPE_KEY")}
                    </InputLabel>
                    <Select
                      multiple
                      value={this.state.multiSelect}
                      onChange={this.handleChangeMulti}
                      id="multiSelect"
                      input={<Input />}
                      renderValue={(selected) => selected.join(", ")}
                    >
                      {this.state.statemultiSelect.map((name) => (
                        <MenuItem key={name.value} value={name.value}>
                          <Checkbox
                            checked={
                              this.state.multiSelect.indexOf(name.label) > -1
                            }
                          />
                          <ListItemText primary={name.label} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item md={4} sm={6} xs={10}>
                  <FormControl style={{ width: "70%" }}>
                    <InputLabel>
                      {getLocaleLabels("Locale", "LC_LOCALE_KEY")}
                    </InputLabel>
                    <Select
                      open={this.state.open}
                      onClose={this.handleClose}
                      onOpen={this.handleOpen}
                      value={this.state.locale}
                      onChange={this.handleChangeLocale}
                    >
                      {this.state.statelocale.map((name) => (
                        <MenuItem key={name.value} value={name.value}>
                          {name.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Hidden mdUp>
                  <Grid item md={4} sm={6} xs={10}></Grid>
                </Hidden>

                <Grid item md={6} sm={6} xs={12}>
                  <Button
                    variant="contained"
                    style={{
                      width: "60%",
                      marginTop: "2rem",
                      background: "#fff",
                      color: "#333",
                    }}
                    color="secondary"
                    onClick={this.onReset}
                  >
                    {" "}
                    {getLocaleLabels("reset", "LC_RESET_KEY")}
                  </Button>
                </Grid>

                <Grid item md={6} sm={6} xs={12}>
                  <Button
                    variant="contained"
                    style={{
                      width: "60%",
                      marginTop: "2rem",
                      background: "#666666",
                      color: "#fff",
                    }}
                    color="secondary"
                    onClick={this.onSearch}
                    disabled={!enabled}
                  >
                    {" "}
                    {getLocaleLabels("Search", "LC_SEARCH_KEY")}
                  </Button>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>

        <Grid container justify="center" alignItems="center">
          <Grid item md={11} sm={11} xs={11}>
            <MaterialTable
              title={`${getLocaleLabels(
                "Localization Search Results",
                "LC_SEARCH_RESULTS_KEY"
              )}( ${newSearch.length} )`}
              options={{
                filtering: true,
                sorting: true,
                search: true,
                // exportButton: true,
                actionsColumnIndex: -1,
                pageSize: 10,
                pageSizeOptions: [5, 10, 25, 50, 75, 100],
                addRowPosition: "first",
                exportButton: true,
                exportAllData: true,
              }}
              editable={{
                onRowAdd: (newData) =>
                  new Promise((resolve) => {
                    setTimeout(() => {
                      resolve();
                      this.setState((prevState) => {
                        const data = [...prevState.data];
                        console.log(newData, "newData", "data:", data);
                        return { ...prevState, data, newData: newData };
                      });
                      this.onCreate();
                    }, 600);
                  }),
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve) => {
                    setTimeout(() => {
                      resolve();
                      if (oldData) {
                        console.log(oldData, "oldData");
                        this.setState((prevState) => {
                          const data = [...prevState.data];
                          const id = data.indexOf(oldData);
                          data[data.indexOf(oldData)] = newData;
                          return { ...prevState, data, id: id, datas: newData };
                        });
                        console.log("data", newData);
                        this.onUpdate(this.state.id);
                      }
                    }, 600);
                  }),
                onRowDelete: (oldData) =>
                  new Promise((resolve) => {
                    setTimeout(() => {
                      resolve();
                      this.setState((prevState) => {
                        const data = [...prevState.data];
                        const id = data.indexOf(oldData);
                        return { ...prevState, data, newData: oldData, id: id };
                      });
                      this.onDelete(this.state.id);
                    }, 600);
                  }),
              }}
              columns={columns}
              data={newSearch}
              icons={tableIcons}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleSnackbar: (message, errorType) =>
      dispatch(toggleSnackbar(true, message, errorType)),
  };
};

export default connect(null, mapDispatchToProps)(ApiTable);
