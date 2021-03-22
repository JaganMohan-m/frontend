import React from "react";
import { getTranslatedLabel } from "egov-ui-kit/utils/commons";
import { Card } from "components";
import Label from "egov-ui-kit/utils/translationNode";
// import { connect } from "react-redux";
import { initLocalizationLabels } from "egov-ui-kit/redux/app/utils";
import { getLocale } from "egov-ui-kit/utils/localStorageUtils";
import PropertyInfoCard from "../PropertyInfoCard";
import moment from "moment";


const locale = getLocale() || "en_IN";
const localizationLabelsData = initLocalizationLabels(locale);



// const getAddressItems = (addressObj) => {
//   return (
//     addressObj && [
//       // {
//       //   // heading: getTranslatedLabel("PT_PROPERTY_ADDRESS_SUB_HEADER", localizationLabelsData),
//       //   // // iconAction: "action",
//       //   // iconName: "home",
//       //   items: [
//       {
//         key: getTranslatedLabel("PT_PROPERTY_ADDRESS_CITY", localizationLabelsData),
//         value: addressObj.city || "NA",
//       },
//       {
//         key: getTranslatedLabel("PT_PROPERTY_ADDRESS_HOUSE_NO", localizationLabelsData),
//         value: addressObj.doorNo || "NA",
//       },
//       {
//         key: getTranslatedLabel("PT_PROPERTY_ADDRESS_COLONY_NAME", localizationLabelsData),
//         value: addressObj.buildingName || "NA",
//       },
//       {
//         key: getTranslatedLabel("PT_PROPERTY_ADDRESS_STREET_NAME", localizationLabelsData),
//         value: addressObj.street || "NA",
//       },
//       {
//         key: getTranslatedLabel("PT_PROPERTY_ADDRESS_MOHALLA", localizationLabelsData),
//         value: addressObj.locality.name || "NA",
//       },
//       {
//         key: getTranslatedLabel("PT_PROPERTY_ADDRESS_PINCODE", localizationLabelsData),
//         value: addressObj.pincode || "NA",
//       },

//       //   ],
//       // },
//     ]
//   );
// };
const transform = (floor, key, generalMDMSDataById, propertyDetails) => {
  const { propertySubType, usageCategoryMajor } = propertyDetails;
  const { masterName, dataKey } = key;
  if (!masterName) {
    return floor["occupancyType"] === "RENTED" ? `INR ${floor["arv"]}` : `${Math.round(floor[dataKey] * 100) / 100} sq yards`;
  } else {
    if (floor[dataKey]) {
      if (dataKey === "usageCategoryDetail") {
        return generalMDMSDataById["UsageCategoryDetail"]
          ? generalMDMSDataById["UsageCategoryDetail"][floor[dataKey]].name
          : generalMDMSDataById["UsageCategorySubMinor"]
            ? generalMDMSDataById["UsageCategorySubMinor"][floor["usageCategorySubMinor"]].name
            : "NA";
      }
      // if (usageCategoryMajor === "RESIDENTIAL" && propertySubType === "SHAREDPROPERTY" && dataKey === "floorNo") {
      //   return "NA";
      // }
      if (floor[dataKey] === "NONRESIDENTIAL") {
        return generalMDMSDataById["UsageCategoryMinor"] ? generalMDMSDataById["UsageCategoryMinor"][floor["usageCategoryMinor"]].name : "NA";
      } else {
        return generalMDMSDataById[masterName] ? generalMDMSDataById[masterName][floor[dataKey]].name : "NA";
      }
    } else {
      return "NA";
    }
  }
};
// const getAssessmentInfo = (propertyDetails, keys=[], generalMDMSDataById) => {
//     const { units } = propertyDetails || {};

//     return (
//       propertyDetails && [
//         {
//           heading: getTranslatedLabel("PT_ASSESMENT_INFO_SUB_HEADER", localizationLabelsData),
//           iconAction: "action",
//           iconName: "assignment",
//           showTable: true,
//           tableHeaderItems: [
//             {
//               key: getTranslatedLabel("PT_ASSESMENT_INFO_USAGE_TYPE", localizationLabelsData),
//               value: propertyDetails.usageCategoryMajor ? propertyDetails.usageCategoryMajor : "NA", //noOfFloors
//             },
//             {
//               key: getTranslatedLabel("PT_ASSESMENT_INFO_TYPE_OF_BUILDING", localizationLabelsData),
//               value: generalMDMSDataById
//                 ? propertyDetails.propertySubType
//                   ? generalMDMSDataById["PropertySubType"]
//                     ? generalMDMSDataById["PropertySubType"][propertyDetails.propertySubType].name
//                     : "NA"
//                   : generalMDMSDataById["PropertyType"]
//                     ? generalMDMSDataById["PropertyType"][propertyDetails.propertyType].name
//                     : "NA"
//                 : "NA",
//             },
//             {
//               key: getTranslatedLabel("PT_ASSESMENT_INFO_PLOT_SIZE", localizationLabelsData),
//               value:
//                 propertyDetails.propertySubType === "SHAREDPROPERTY"
//                   ? "NA"
//                   : propertyDetails.uom
//                     ? `${propertyDetails.landArea} ${propertyDetails.uom}`
//                     : `${Math.round(propertyDetails.landArea * 100) / 100} sq yards`,
//             },
//             {
//               key: getTranslatedLabel("PT_ASSESMENT_INFO_NO_OF_FLOOR", localizationLabelsData),
//               value: propertyDetails.noOfFloors ? `${propertyDetails.noOfFloors}` : "NA", //noOfFloors
//             },
//           ],
//           items: {
//             header: units
//               ? [
//                 getTranslatedLabel("PT_ASSESMENT_INFO_FLOOR", localizationLabelsData),
//                 getTranslatedLabel("PT_ASSESMENT_INFO_USAGE_TYPE", localizationLabelsData),
//                 // getTranslatedLabel("PT_ASSESMENT_INFO_SUB_USAGE_TYPE", localizationLabelsData),
//                 getTranslatedLabel("PT_ASSESMENT_INFO_OCCUPLANCY", localizationLabelsData),
//                 getTranslatedLabel("PT_ASSESMENT_INFO_AREA_RENT", localizationLabelsData),
//               ]
//               : [],
//             values: units
//               ? units.map((floor) => {
//                 return {
//                   value: keys.map((key) => {
//                     return transform(floor, key, generalMDMSDataById, propertyDetails);
//                   }),
//                 };
//               })
//               : [],
//           },
//         },
//       ]
//     );
//   };
const getAssessmentInfo = (propertyDetails, generalMDMSDataById) => {


  const { units = [], noOfFloors,additionalDetails={} } = propertyDetails || {};
  var construction_date =(additionalDetails && additionalDetails.constructionYear)? moment(additionalDetails.constructionYear).format('DD-MM-YYYY'):null;

    if(!propertyDetails){
      return []
    }
    let properties= [
      {
        key: getTranslatedLabel("PT_ASSESMENT_INFO_USAGE_TYPE", localizationLabelsData),
        value: propertyDetails.usageCategoryMajor ? 'PROPERTYTAX_BILLING_SLAB_' + propertyDetails.usageCategoryMajor : "NA", //noOfFloors
      },
      {
        key: getTranslatedLabel("PT_ASSESMENT_INFO_TYPE_OF_BUILDING", localizationLabelsData),
        value: generalMDMSDataById
          ? propertyDetails.propertySubType
            ? generalMDMSDataById["PropertySubType"]
              ? `PROPERTYTAX_BILLING_SLAB_${generalMDMSDataById["PropertySubType"][propertyDetails.propertySubType].code}`
              : "NA"
            : generalMDMSDataById["PropertyType"]
              ? `PROPERTYTAX_BILLING_SLAB_${generalMDMSDataById["PropertyType"][propertyDetails.propertyType].code}`
              : "NA"
          : "NA",
      },
      {
        key: getTranslatedLabel("PT_ASSESMENT_INFO_PLOT_SIZE", localizationLabelsData),
        value:
          propertyDetails.propertySubType === "SHAREDPROPERTY"
            ? "NA"
            : propertyDetails.uom
              ? `${propertyDetails.landArea} ${propertyDetails.uom}`
              : `${Math.round(propertyDetails.landArea * 100) / 100}  ${getTranslatedLabel("PT_LABEL_SQFT", localizationLabelsData)}`,
      }
    ]

    if (propertyDetails.propertyType != "VACANT") {
  properties.push(
    propertyDetails.propertySubType === "SHAREDPROPERTY"
      ? {
          key: getTranslatedLabel("PT_FLOOR_NO", localizationLabelsData),
          value: units.length > 0  ? units[0] && `${units[0].floorNo}` : "NA",
        }
      : {
          key: getTranslatedLabel("PT_ASSESMENT_INFO_NO_OF_FLOOR", localizationLabelsData),
          value: noOfFloors ? `${noOfFloors}` : "NA", //noOfFloors
        }
  );
}
properties.push({
  key: getTranslatedLabel("PT_ASSESMENT_INFO_CONSTRUCTION_DATE", localizationLabelsData),
  value: construction_date ? `${construction_date}` : "NA",
});

  return properties;
};


const getUnitInfo = (units = [],usageCategoryMajor="",buildUpArea) => {
  units = units || [];
  let floors = [];
  units && units.length>0 ? units.forEach((unit={}, index) => {
    if(unit){
    let floor = [{
      key: getTranslatedLabel("PT_ASSESSMENT_UNIT_USAGE_TYPE", localizationLabelsData),
      value: unit && unit.usageCategoryMinor ? 'PROPERTYTAX_BILLING_SLAB_' + unit.usageCategoryMinor :
        (unit.usageCategoryMajor||usageCategoryMajor) ? 'PROPERTYTAX_BILLING_SLAB_' + (unit.usageCategoryMajor||usageCategoryMajor) : "NA",
    }
    ,{
      key: getTranslatedLabel("PT_ASSESMENT_INFO_OCCUPLANCY", localizationLabelsData),
      value: unit.occupancyType ? 'PROPERTYTAX_OCCUPANCYTYPE_' + unit.occupancyType : "NA",
    },
    {
      key: getTranslatedLabel("PT_ASSESMENT_INFO_CONSTRUCTION_TYPE", localizationLabelsData),
      value: (unit.constructionType||unit.ConstructionType) ? 'PROPERTYTAX_CONSTRUCTIONTYPE_' + (unit.constructionType||unit.ConstructionType) : "NA",
    },
    {
      key: getTranslatedLabel("PT_ASSESMENT_INFO_INNER_DIMENSION", localizationLabelsData),
      value: unit.additionalDetails && unit.additionalDetails.innerDimensionsKnown ? unit.additionalDetails.innerDimensionsKnown == "true" ? "COMMON_MASTER_TRUE" : "COMMON_MASTER_FALSE" : "COMMON_MASTER_FALSE",
    }];
    if (unit.additionalDetails && unit.additionalDetails.innerDimensionsKnown == "true") {
      floor.push({
        key: getTranslatedLabel("PROPERTYTAX_BILLING_SLAB_SUBMNR26", localizationLabelsData),
        value: unit.additionalDetails && unit.additionalDetails.roomsArea ? unit.additionalDetails.roomsArea + '' : "NA",
      },
        {
          key: getTranslatedLabel("PROPERTYTAX_BILLING_SLAB_SUBMNR27", localizationLabelsData),
          value: unit.additionalDetails && unit.additionalDetails.commonArea ? unit.additionalDetails.commonArea + '' : "NA",
        },
        {
          key: getTranslatedLabel("PROPERTYTAX_BILLING_SLAB_SUBMNR28", localizationLabelsData),
          value: unit.additionalDetails && unit.additionalDetails.garageArea ? unit.additionalDetails.garageArea + '' : "NA",
        },
        {
          key: getTranslatedLabel("PROPERTYTAX_BILLING_SLAB_SUBMNR29", localizationLabelsData),
          value: unit.additionalDetails && unit.additionalDetails.bathroomArea ? unit.additionalDetails.bathroomArea + '' : "NA",
        })
    }
    // else {
      floor.push(
        {
          key: getTranslatedLabel("PT_FORM2_BUILT_AREA", localizationLabelsData),
          value: unit.unitArea ? unit.unitArea + '' : "NA",
        })
    // }
    if (usageCategoryMajor=="RESIDENTIAL") {
      floor.push(
        {
          key: getTranslatedLabel("PT_FORM2_TOTAL_BUILT_AREA", localizationLabelsData),
          value: buildUpArea ? buildUpArea + '' : "NA",
        })
    }

    if (usageCategoryMajor!="RESIDENTIAL") {
      floor.push(
        {
          key: getTranslatedLabel("PT_FORM2_SUB_USAGE_TYPE", localizationLabelsData),
          value: unit && unit.usageCategoryMinor ? 'PROPERTYTAX_BILLING_SLAB_' + unit.usageCategorySubMinor :
            (unit.usageCategorySubMinor||unit.usageCategoryDetail) ? 'PROPERTYTAX_BILLING_SLAB_' + (unit.usageCategorySubMinor||unit.usageCategoryDetail) : "NA",
        })
    }


    // if (unit.occupancyType === "RENTED") {
      floor.push({
        key: getTranslatedLabel("PT_FORM2_TOTAL_ANNUAL_RENT", localizationLabelsData),
        value: unit.arv ? unit.arv + '' : "NA",
      })
    // }
    if (!floors[unit['floorNo']]) {
      floors[unit['floorNo']] = [floor];
    } else {
      floors[unit['floorNo']].push(floor);
    }
   
  }}): []
  return floors;
}





const AssessmentInfo = ({ properties, editIcon, generalMDMSDataById }) => {
  let hideSubsectionLabel = false;
  let assessmentItems = [];
  let subUnitItems = [];
  const header = 'PT_ASSESMENT_INFO_SUB_HEADER';
  if (properties) {
    const { propertyDetails } = properties;
    if (propertyDetails && propertyDetails.length > 0) {     
      subUnitItems = getUnitInfo(propertyDetails[0]['units'],propertyDetails[0]['usageCategoryMajor']?propertyDetails[0]['usageCategoryMajor']:"",propertyDetails[0]['buildUpArea']);
      assessmentItems = getAssessmentInfo(propertyDetails[0], generalMDMSDataById);
      if (propertyDetails[0].propertySubType === "SHAREDPROPERTY") {
        hideSubsectionLabel = true;
      }
    }
  }

  return (
    <PropertyInfoCard editIcon={editIcon} items={assessmentItems} header={header} subSection={subUnitItems} hideSubsectionLabel={hideSubsectionLabel} ></PropertyInfoCard>
  );
};

export default AssessmentInfo;
