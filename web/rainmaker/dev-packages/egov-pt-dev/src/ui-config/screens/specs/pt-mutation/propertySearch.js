import commonConfig from "config/common.js";
import { getBreak, getCommonHeader, getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg, getRequiredDocData } from "egov-ui-framework/ui-utils/commons";
import { getTenantId,getLocale } from "egov-ui-kit/utils/localStorageUtils";
import "./index.css";
import { resetFields } from "./mutation-methods";
import propertySearchTabs from "./property-search-tabs";
import { searchApplicationTable, searchPropertyTable } from "./searchResource/searchResults";
import { showHideAdhocPopup } from "../utils";
import { httpRequest } from "../../../../ui-utils";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = true;
enableButton = hasButton && hasButton === "false" ? false : true;
const tenant = getTenantId();

//console.log(captureMutationDetails);

const getMDMSData = async (action, dispatch) => {
   const moduleDetails= [
        {
           moduleName: "PropertyTax", 
           masterDetails: [
             { name: "Documents" }
            ] 
          },
        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants"
            }, { name: "citymodule" }
          ]
        } 
      ]
   
  try {
    getRequiredDocData(action, dispatch, moduleDetails).then((payload)=>{
      if (process.env.REACT_APP_NAME != "Citizen") {
        dispatch(
          prepareFinalObject(
            "searchScreen.tenantId",
            tenant
          )
        );
      }
    })
    if (process.env.REACT_APP_NAME != "Citizen") {
      let mohallaPayload = await httpRequest(
        "post",
        "/egov-location/location/v11/boundarys/_search?hierarchyTypeCode=REVENUE&boundaryType=Locality",
        "_search",
        [{ key: "tenantId", value: tenant }],
        {}
      );
      if(mohallaPayload &&
        mohallaPayload.TenantBoundary[0] &&
        mohallaPayload.TenantBoundary[0].boundary){
  
          const mohallaData =
          mohallaPayload.TenantBoundary[0].boundary.reduce((result, item) => {
            result.push({
              ...item,
              code: item.code
            });
            return result;
            // code: `${tenant
            //   .toUpperCase()
            //   .replace(/[.]/g, "_")}_REVENUE_${item.code
            //   .toUpperCase()
            //   .replace(/[._:-\s\/]/g, "_")}`
          }, []);
          dispatch(prepareFinalObject("searchScreenMdmsData.tenant.localities", mohallaData))
        }
      }
    // const payload = await httpRequest(
    //   "post",
    //   "/egov-mdms-service/v1/_search",
    //   "_search",
    //   [],
    //   mdmsBody
    // );
    // payload.MdmsRes.tenant.tenants = payload.MdmsRes.tenant.citymodule[1].tenants;


    // let documents = get(
    //   payload.MdmsRes,
    //   "PropertyTax.Documents",
    //   []
    // );

    // let documentUi = getRequiredDocuments(documents);
    // set(documentUi, 'children.header.children.header.children.key.props.labelKey', 'PT_REQ_DOCS_HEADER')
    // set(documentUi, 'children.footer.children.footer.children.applyButton.children.applyButtonLabel.props.labelKey', 'PT_COMMON_BUTTON_APPLY')
    // set(documentUi, 'children.footer.children.footer.children.applyButton.onClickDefination', {
    //   action: "condition",
    //   callBack: startApplyFlow
    // })
    // set(
    //   action,
    //   "screenConfig.components.adhocDialog.children.popup",
    //   documentUi
    // );



    // console.log("payload--", payload)
    // dispatch(prepareFinalObject("searchScreenMdmsData", payload.MdmsRes));
  //   if (process.env.REACT_APP_NAME != "Citizen") {
  //     dispatch(
  //       prepareFinalObject(
  //         "searchScreen.tenantId",
  //         tenant
  //       )
  //     );
  //   }
  // }
  } catch (e) {
    console.log(e);
  }
};

const header = getCommonHeader({
  labelName: "Property Tax",
  labelKey: "PROPERTY_TAX"
});
const screenConfig = {
  uiFramework: "material-ui",
  name: "propertySearch",

  beforeInitScreen: (action, state, dispatch) => {
    resetFields(state, dispatch);
    dispatch(fetchLocalizationLabel(getLocale(), getTenantId(), getTenantId()));
    getMDMSData(action, dispatch);
    return action;
  },

  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "search"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",

          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 6
              },
              ...header
            },
            newApplicationButton: {
              componentPath: "Button",
              gridDefination: {
                xs: 12,
                sm: 6,
                align: "right"
              },
              visible: enableButton,
              props: {
                variant: "contained",
                color: "primary",
                style: {
                  color: "white",
                  borderRadius: "2px",
                  width: "250px",
                  height: "48px"
                }
              },

              children: {
                plusIconInsideButton: {
                  uiFramework: "custom-atoms",
                  componentPath: "Icon",
                  props: {
                    iconName: "add",
                    style: {
                      fontSize: "24px"
                    }
                  }
                },

                buttonLabel: getLabel({
                  labelName: "Add New Property",
                  labelKey: "PT_ADD_NEW_PROPERTY_BUTTON"
                })
              },
              onClickDefination: {
                action: "condition",
                callBack: (state, dispatch) => {
                  showHideAdhocPopup(state, dispatch, "propertySearch");

                }
              },
              // roleDefination: {
              //   rolePath: "user-info.roles",
              //   path : "tradelicence/apply"

              // }
            }
          }
        },
        propertySearchTabs,
        breakAfterSearch: getBreak(),
        searchPropertyTable,
        searchApplicationTable

      }
    },
    adhocDialog: {
      uiFramework: "custom-containers",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: false,
        screenKey: "propertySearch"
      },
      children: {
        popup: {}
      }
    }
  }
};

export default screenConfig;

