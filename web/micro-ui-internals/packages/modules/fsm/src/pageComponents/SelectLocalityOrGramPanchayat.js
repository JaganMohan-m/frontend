import { CardLabel, Dropdown, FormStep, LabelFieldPair, TextInput } from "@egovernments/digit-ui-react-components";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Timeline from "../components/TLTimelineInFSM";

const SelectLocalityOrGramPanchayat = ({ t, config, onSelect, userType, formData, formState }) => {
  const allCities = Digit.Hooks.fsm.useTenants();
  let tenantId = Digit.ULBService.getCurrentTenantId();
  if (userType !== "employee") {
    tenantId = Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")?.code;
  }
  const { data: urcConfig } = Digit.Hooks.fsm.useMDMS(tenantId, "FSM", "UrcConfig");
  const isUrcEnable = urcConfig && urcConfig.length > 0 && urcConfig[0].URCEnable;
  const { pincode, city, propertyLocation } = formData?.address || "";
  const cities =
    userType === "employee"
      ? allCities.filter((city) => city.code === tenantId)
      : pincode
      ? allCities.filter((city) => city?.pincode?.some((pin) => pin == pincode))
      : allCities;
  const [selectedLocality, setSelectedLocality] = useState();
  const [localities, setLocalities] = useState();
  const [gramPanchayats, setGramPanchayats] = useState();
  const [selectedGp, setSelectedGp] = useState(() =>
    formData?.address?.additionalDetails?.gramPanchayat ? formData?.address?.additionalDetails?.gramPanchayat : {}
  );
  const [villages, setVillages] = useState([]);
  const [selectedVillage, setSelectedVillage] = useState(() =>
    formData?.address?.additionalDetails?.village ? formData?.address?.additionalDetails?.village : {}
  );
  const [newVillage, setNewVillage] = useState();

  const [selectedCity, setSelectedCity] = useState(() => formData?.address?.city || Digit.SessionStorage.get("fsm.file.address.city") || null);
  useEffect(() => {
    if (cities) {
      if (cities.length === 1) {
        setSelectedCity(cities[0]);
      }
    }
  }, [cities]);
  var { data: fetchedGramPanchayats } = Digit.Hooks.useBoundaryLocalities(
    selectedCity?.code,
    "gramPanchayats",
    {
      enabled: !!selectedCity,
    },
    t
  );

  var { data: fetchedLocalities } = Digit.Hooks.useBoundaryLocalities(
    selectedCity?.code,
    "revenue",
    {
      enabled: !!selectedCity,
    },
    t
  );

  useEffect(() => {
    if (selectedCity && fetchedLocalities) {
      let __localityList = fetchedLocalities;
      let filteredLocalityList = [];

      if (formData?.address?.locality) {
        setSelectedLocality(formData.address.locality);
      }

      if (formData?.address?.pincode) {
        filteredLocalityList = __localityList.filter((obj) => obj.pincode?.find((item) => item == formData.address.pincode));
        if (!formData?.address?.locality) setSelectedLocality();
      }
      setLocalities(() => (filteredLocalityList.length > 0 ? filteredLocalityList : __localityList));

      if (filteredLocalityList.length === 1) {
        setSelectedLocality(filteredLocalityList[0]);
        if (userType === "employee") {
          onSelect(config.key, {
            ...formData[config.key],
            locality: filteredLocalityList[0],
          });
        }
      }
    }
  }, [selectedCity, fetchedLocalities]);

  useEffect(() => {
    if (fetchedGramPanchayats) {
      if (fetchedGramPanchayats && fetchedGramPanchayats.length > 0) {
        setGramPanchayats(fetchedGramPanchayats);
      }
      if (formData?.address?.additionalDetails?.gramPanchayat.code) {
        const filteredGramPanchayat = fetchedGramPanchayats.filter(
          (obj) => obj.code === formData?.address?.additionalDetails?.gramPanchayat?.code
        )[0];
        setSelectedGp(filteredGramPanchayat);
        var villageUnderGp = filteredGramPanchayat?.children.filter((obj) => obj.code === formData?.address?.additionalDetails?.village?.code);
        if (villageUnderGp.length > 0) {
          villageUnderGp[0].i18nkey = tenantId.replace(".", "_").toUpperCase() + "_REVENUE_" + villageUnderGp[0].code;
          setSelectedVillage(villageUnderGp[0]);
          setVillages(villageUnderGp);
        } else {
          setNewVillage(typeof formData?.address?.additionalDetails?.village === "string" ? formData?.address?.additionalDetails?.village : "");
        }
      }
    }
  }, [fetchedGramPanchayats, formData?.address?.additionalDetails?.gramPanchayat.code]);
  if (userType !== "employee" && propertyLocation?.code === "FROM_GRAM_PANCHAYAT") {
    config.texts.cardText = "CS_FILE_APPLICATION_PROPERTY_LOCATION_GRAM_PANCHAYAT_TEXT";
  }

  function selectLocality(locality) {
    setSelectedLocality(locality);
    if (userType === "employee") {
      onSelect(config.key, { ...formData[config.key], locality: locality });
    }
  }

  function selectGramPanchayat(value) {
    setSelectedGp(value);
    const filteredVillages = fetchedGramPanchayats.filter((items) => items.code === value.code)[0].children;
    const localitiesWithLocalizationKeys = filteredVillages.map((obj) => ({
      ...obj,
      i18nkey: tenantId.replace(".", "_").toUpperCase() + "_REVENUE_" + obj.code,
    }));
    if (localitiesWithLocalizationKeys.length > 0) {
      setVillages(localitiesWithLocalizationKeys);
    }
    if (userType === "employee") {
      onSelect(config.key, { ...formData[config.key], gramPanchayat: value });
    }
  }

  function selectVillage(value) {
    setSelectedVillage(value);
    if (userType === "employee") {
      onSelect(config.key, { ...formData[config.key], village: value });
    }
  }

  const onChangeVillage = (value) => {
    setNewVillage(value);
    if (userType === "employee") {
      onSelect(config.key, { ...formData[config.key], village: value });
    }
  };

  function onSubmit() {
    if (propertyLocation?.code === "FROM_GRAM_PANCHAYAT") {
      onSelect(config.key, {
        gramPanchayat: selectedGp,
        village: selectedVillage ? selectedVillage : newVillage,
      });
    } else {
      onSelect(config.key, { locality: selectedLocality });
    }
  }
  if (userType === "employee") {
    return (
      <div>
        {propertyLocation?.code === "FROM_GRAM_PANCHAYAT" ? (
          <div>
            <LabelFieldPair>
              <CardLabel className="card-label-smaller">
                {t("CS_GRAM_PANCHAYAT")}
                {config.isMandatory ? " * " : null}
              </CardLabel>
              <Dropdown
                className="form-field"
                isMandatory
                selected={selectedGp}
                option={gramPanchayats}
                select={selectGramPanchayat}
                optionKey="i18nkey"
                t={t}
              />
            </LabelFieldPair>
            {villages.length > 0 && (
              <LabelFieldPair>
                <CardLabel className="card-label-smaller">{t("CS_VILLAGE_NAME")}</CardLabel>
                <Dropdown
                  className="form-field"
                  isMandatory
                  selected={selectedVillage}
                  option={villages}
                  select={selectVillage}
                  optionKey="i18nkey"
                  t={t}
                />
              </LabelFieldPair>
            )}
            {villages.length === 0 && (
              <LabelFieldPair>
                <CardLabel className="card-label-smaller">{t("CS_VILLAGE_NAME")}</CardLabel>
                <div className="field">
                  <TextInput id="village" key="village" value={newVillage} onChange={(e) => onChangeVillage(e.target.value)} />
                </div>
              </LabelFieldPair>
            )}
          </div>
        ) : (
          isUrcEnable && (
            <LabelFieldPair>
              <CardLabel className="card-label-smaller">
                {t("CS_CREATECOMPLAINT_MOHALLA")}
                {config.isMandatory ? " * " : null}
              </CardLabel>
              <Dropdown
                className="form-field"
                isMandatory
                selected={selectedLocality}
                option={fetchedLocalities}
                select={selectLocality}
                optionKey="i18nkey"
                t={t}
              />
            </LabelFieldPair>
          )
        )}
      </div>
    );
  }
  return (
    <React.Fragment>
      <Timeline currentStep={1} flow="APPLY" />
      <FormStep
        config={config}
        onSelect={onSubmit}
        isDisabled={propertyLocation?.code === "WITHIN_ULB_LIMITS" ? !selectedLocality : !selectedGp}
        t={t}
      >
        {propertyLocation?.code === "WITHIN_ULB_LIMITS" ? (
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">
              {`${t("CS_CREATECOMPLAINT_MOHALLA")} *`}
              {/* {config.isMandatory ? " * " : null} */}
            </CardLabel>
            <Dropdown
              className="form-field"
              isMandatory
              selected={selectedLocality}
              option={fetchedLocalities}
              select={selectLocality}
              optionKey="i18nkey"
              t={t}
            />
          </LabelFieldPair>
        ) : (
          <div>
            <LabelFieldPair>
              <CardLabel className="card-label-smaller">
                {`${t("CS_GRAM_PANCHAYAT")} *`}
                {/* {config.isMandatory ? " * " : null} */}
              </CardLabel>
              <Dropdown
                className="form-field"
                isMandatory
                selected={selectedGp}
                option={gramPanchayats}
                select={selectGramPanchayat}
                optionKey="i18nkey"
                t={t}
              />
            </LabelFieldPair>
            {villages.length > 0 && (
              <LabelFieldPair>
                <CardLabel className="card-label-smaller">{t("CS_VILLAGE_NAME")}</CardLabel>
                <Dropdown
                  className="form-field"
                  isMandatory
                  selected={selectedVillage}
                  option={villages}
                  select={selectVillage}
                  optionKey="i18nkey"
                  t={t}
                />
              </LabelFieldPair>
            )}
            {villages.length === 0 && (
              <LabelFieldPair>
                <CardLabel className="card-label-smaller">{t("CS_VILLAGE_NAME")}</CardLabel>
                <TextInput
                  style={{ width: "86%" }}
                  type="text"
                  id="village"
                  key="village"
                  value={newVillage}
                  onChange={(e) => onChangeVillage(e.target.value)}
                />
              </LabelFieldPair>
            )}
          </div>
        )}
      </FormStep>
    </React.Fragment>
  );
};

export default SelectLocalityOrGramPanchayat;
