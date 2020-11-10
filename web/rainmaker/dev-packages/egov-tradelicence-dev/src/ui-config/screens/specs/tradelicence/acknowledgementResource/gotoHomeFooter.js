import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { ifUserRoleExists } from "../../utils";
import "./index.css";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
const getCommonApplyFooter = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer"
    },
    children
  };
};

const getRedirectionURL = () => {
  /* Mseva 2.0 changes */
  const redirectionURL = ifUserRoleExists("CITIZEN")
    ? // ? "/tradelicense-citizen/home"
      "/"
    : "/inbox";
  return redirectionURL;
};
let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
  let tenant = getQueryArg(window.location.href, "tenantId");
  let purpose1 = getQueryArg(window.location.href, "purpose");
export const gotoHomeFooter = getCommonApplyFooter({
  
  gotoHome: {
    componentPath: "Button",
    
    props: {
      variant: "outlined",
      className:"home-footer",
      color: "primary",
      style: {
    //    minWidth: "200px",
        height: "48px",
        marginRight: "16px"
      }
    },
    children: {
      downloadReceiptButtonLabel: getLabel({
        labelName: "GO TO HOME",
        labelKey: "TL_COMMON_BUTTON_HOME"
      })
    },
    onClickDefination: {
      action: "page_change",
      path: `${getRedirectionURL()}`
    }
  },
  proceedToPaymentButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
     // visible: (getButtonVisibility(purpose === "apply") || getButtonVisibility(status === "success")) ,
      style: {
        //  minWidth: "170px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      proceedToPaymentButtonLabel: getLabel({
        labelName: "Proceed to payment",
        labelKey: "TL_PROCEED_PAYMENT"
      })
    },
    //Add onClickDefination and RoleDefination later
    onClickDefination: {
      action: "page_change",
      path:`search-preview?applicationNumber=${applicationNumber}&tenantId=${tenant}&businessService=TL`,
      //    /egov-common/pay?consumerCode=PB-TL-2020-09-03-023202&tenantId=pb.mohali&businessService=TL
     
      // process.env.REACT_APP_SELF_RUNNING === "true"
      //   ? `/egov-ui-framework/fire-noc/pay?applicationNumber=${applicationNumber}&tenantId=${tenant}&businessService=FIRENOC`
      //   : `/fire-noc/pay?applicationNumber=${applicationNumber}&tenantId=${tenant}&businessService=FIRENOC`
    },
    roleDefination: {
      rolePath: "user-info.roles",
      action: "PAY",
      roles: ["TL_CEMP", "SUPERUSER", "CITIZEN"]
    },
    visible:purpose1 ==="apply" ||  purpose1 ==="EDITRENEWAL" || purpose1 === "DIRECTRENEWAL"  ? true :false
  },
});
