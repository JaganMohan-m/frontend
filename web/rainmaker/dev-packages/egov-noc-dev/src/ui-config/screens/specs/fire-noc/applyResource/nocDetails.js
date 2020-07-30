import {
  getBreak,
  getCommonCard,
  getCommonContainer,
  getCommonTitle,
  getTextField,
  getPattern,
  getSelectField
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  furnishNocResponse,
  getSearchResults
} from "../../../../../ui-utils/commons";

const loadProvisionalNocData = async (state, dispatch) => {
  let fireNOCNumber = get(
    state,
    "screenConfiguration.preparedFinalObject.FireNOCs[0].provisionFireNOCNumber",
    ""
  );


  if (!fireNOCNumber.match(getPattern("FireNOCNo"))) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Incorrect FireNOC Number!",
          labelKey: "ERR_FIRENOC_NUMBER_INCORRECT"
        },
        "error"
      )
    );
    return;
  }

  let response = await getSearchResults([
    { key: "fireNOCNumber", value: fireNOCNumber }
  ]);

  response = furnishNocResponse(response);

  dispatch(prepareFinalObject("FireNOCs", get(response, "FireNOCs", [])));

  // Set no of buildings radiobutton and eventually the cards
  let noOfBuildings =
    get(response, "FireNOCs[0].fireNOCDetails.noOfBuildings", "SINGLE") ===
      "MULTIPLE"
      ? "MULTIPLE"
      : "SINGLE";
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardSecondStep.children.propertyDetails.children.cardContent.children.propertyDetailsConatiner.children.buildingRadioGroup",
      "props.value",
      noOfBuildings
    )
  );

  // Set noc type radiobutton to NEW
  // dispatch(
  //   handleField(
  //     "apply",
  //     "components.div.children.formwizardFirstStep.children.nocDetails.children.cardContent.children.nocDetailsContainer.children.nocRadioGroup",
  //     "props.value",
  //     "NEW"
  //   )
  // );

  // Set provisional fire noc number
  dispatch(
    prepareFinalObject(
      "FireNOCs[0].provisionFireNOCNumber",
      get(response, "FireNOCs[0].fireNOCNumber", "")
    )
  );

  // Set fire noc id to null
  dispatch(prepareFinalObject("FireNOCs[0].id", undefined));
};

export const loadProvisionalNocData2 = async (state, dispatch) => {
  let oldfireNOCNumber = get(
    state,
    "screenConfiguration.preparedFinalObject.FireNOCs[0].oldFireNOCNumber",
    ""
  );


  let response = await getSearchResults([
    { key: "FireNOCNumber", value: oldfireNOCNumber }
  ]);

  // let response = await getSearchResults([
  //   { key: "oldFireNOCNumber", value:  }
  // ]);

  let isLegacy = false;
  if (!get(response, "FireNOCs", []).length) {

    isLegacy = true;

  }
  // else{
  //   dispatch(prepareFinalObject("FireNOCs[0].isLegacy",false));

  // }

  response = furnishNocResponse(response);
  console.log("=====response======", response);
  let nocType = get(
    state.screenConfiguration.preparedFinalObject,
    "FireNOCs[0].fireNOCDetails.fireNOCType",
    []
  );
  let oldnocNumber = get(
    state.screenConfiguration.preparedFinalObject,
    "FireNOCs[0].oldFireNOCNumber",
    []
  );
  console.log("------nocType---", nocType);
  dispatch(prepareFinalObject("FireNOCs", get(response, "FireNOCs", [])));

  debugger;
  dispatch(prepareFinalObject("FireNOCs[0].isLegacy", isLegacy));
  dispatch(prepareFinalObject("FireNOCs[0].fireNOCDetails.fireNOCType", nocType));
  dispatch(prepareFinalObject("FireNOCs[0].oldFireNOCNumber", oldnocNumber));
  // Set no of buildings radiobutton and eventually the cards
  let noOfBuildings =
    get(response, "FireNOCs[0].fireNOCDetails.noOfBuildings", "SINGLE") ===
      "MULTIPLE"
      ? "MULTIPLE"
      : "SINGLE";
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardSecondStep.children.propertyDetails.children.cardContent.children.propertyDetailsConatiner.children.buildingRadioGroup",
      "props.value",
      noOfBuildings
    )
  );

  // Set noc type radiobutton to NEW
  // dispatch(
  //   handleField(
  //     "apply",
  //     "components.div.children.formwizardFirstStep.children.nocDetails.children.cardContent.children.nocDetailsContainer.children.nocRadioGroup",
  //     "props.value",
  //     "NEW"
  //   )
  // );

  // Set provisional fire noc number
  dispatch(
    prepareFinalObject(
      "FireNOCs[0].oldFireNOCNumber",
      get(response, "FireNOCs[0].oldFireNOCNumber", "")
    )
  );

  // Set fire noc id to null
  dispatch(prepareFinalObject("FireNOCs[0].id", undefined));
};

export const nocDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "NOC Details",
      labelKey: "NOC_NEW_NOC_DETAILS_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  break: getBreak(),
  nocDetailsContainer: getCommonContainer({

    nocSelect: {
      ...getSelectField({
        label: {
          labelName: "NOC Type",
          labelKey: "NOC_TYPE_LABEL"
        },
        placeholder: {
          labelName: "Select Application Type",
          labelKey: "NOC_APPLICATION_TYPE_PLACEHOLDER"
        },
        data: [
          {
            code: "NEW",
            label: "NOC_TYPE_NEW_RADIOBUTTON"
          },
          {
            code: "PROVISIONAL",
            label: "NOC_TYPE_PROVISIONAL_RADIOBUTTON"
          },
          {
            code: "RENEWAL",
            label: "NOC_TYPE_RENEWAL_RADIOBUTTON"
          }
        ],
        jsonPath: "FireNOCs[0].fireNOCDetails.fireNOCType",
        //required: true
      }),

      beforeFieldChange: (action, state, dispatch) => {
        if (action.value === "PROVISIONAL") {
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.nocDetails.children.cardContent.children.nocDetailsContainer.children.provisionalNocNumber",
              "visible",
              false
            )
          );
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.nocDetails.children.cardContent.children.nocDetailsContainer.children.oldFIRENocNumber",
              "visible",
              false
            )
          );

        }
        else if (action.value === "RENEWAL") {
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.nocDetails.children.cardContent.children.nocDetailsContainer.children.oldFIRENocNumber",
              "visible",
              true
            )
          );
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.nocDetails.children.cardContent.children.nocDetailsContainer.children.provisionalNocNumber",
              "visible",
              false
            )
          );
        }

        else {
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.nocDetails.children.cardContent.children.nocDetailsContainer.children.provisionalNocNumber",
              "visible",
              true
            )
          );
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.nocDetails.children.cardContent.children.nocDetailsContainer.children.oldFIRENocNumber",
              "visible",
              false
            )
          );
        }
      }
    },
    oldFIRENocNumber: {
      ...getTextField({
        label: {
          labelName: "old fire NoC number",
          // labelKey: "NOC_PROVISIONAL_FIRE_NOC_NO_LABEL"
        },
        placeholder: {
          labelName: "Enter old fire NoC number",
          // labelKey: "NOC_PROVISIONAL_FIRE_NOC_NO_PLACEHOLDER"
        },
        pattern: getPattern("FireNOCNo"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        required: true,
        visible: false,
        // pattern: getPattern("MobileNo"),
        jsonPath: "FireNOCs[0].oldFireNOCNumber",
        iconObj: {
          iconName: "search",
          position: "end",
          color: "#FE7A51",
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch, fieldInfo) => {
              loadProvisionalNocData2(state, dispatch);
            }
          }
        }
        // title: {
        //   value: "Please search owner profile linked to the mobile no.",
        //   key: "TL_MOBILE_NO_TOOLTIP_MESSAGE"
        // },
        // infoIcon: "info_circle"
      })
    },
    provisionalNocNumber: {
      ...getTextField({
        label: {
          labelName: "Provisional fire NoC number",
          labelKey: "NOC_PROVISIONAL_FIRE_NOC_NO_LABEL"
        },
        placeholder: {
          labelName: "Enter Provisional fire NoC number",
          labelKey: "NOC_PROVISIONAL_FIRE_NOC_NO_PLACEHOLDER"
        },
        pattern: getPattern("FireNOCNo"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        visible: false,
        // required: true,
        // pattern: getPattern("MobileNo"),
        jsonPath: "FireNOCs[0].provisionFireNOCNumber",
        iconObj: {
          iconName: "search",
          position: "end",
          color: "#FE7A51",
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch, fieldInfo) => {
              loadProvisionalNocData(state, dispatch);
            }
          }
        }
        // title: {
        //   value: "Please search owner profile linked to the mobile no.",
        //   key: "TL_MOBILE_NO_TOOLTIP_MESSAGE"
        // },
        // infoIcon: "info_circle"
      })
    }
  })
});