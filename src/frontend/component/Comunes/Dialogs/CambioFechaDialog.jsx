import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Portal, Dialog, Button, SegmentedButtons } from "react-native-paper";
import theme from "../../../theme/theme";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { styleDialog } from "../../../styles/styles";
import useCambioDia from "../../../hooks/useCambio";
import DatePickerSearchBar from "../Busqueda/DatePickerSearchBar";
import moment from "moment";
import MonedaSelector from "../MonedaSelector";

const CambioFechaDialog = ({ visible, setVisible, keyId }) => {
  const [selectedOption, setSelectedOption] = useState("USD");
  const [fechaSelected, setFechaSelected] = useState(moment().format("YYYY-MM-DD"));
  const { cambio, fetchCambioDia } = useCambioDia(keyId);
  const [filteredCambio, setFilteredCambio] = useState({});

  const handleOptionChange = (value) => {
    setSelectedOption(value);

    const filtered = Object.keys(cambio)
      .filter((key) => key.startsWith(value.toLowerCase()))
      .reduce((acc, key) => {
        acc[key] = cambio[key];
        return acc;
      }, {});
    setFilteredCambio(filtered);
  };

  useEffect(() => {
    fetchCambioDia(`fecha=${fechaSelected}`);
  }, [fechaSelected]);

  useEffect(() => {
    handleOptionChange(selectedOption);
  }, [cambio]);

  return (
    <Portal>
      <Dialog
        style={{ backgroundColor: theme.colors.white }}
        visible={visible}
        onDismiss={() => setVisible(false)}
      >
        <Dialog.Title style={styleDialog.title}>Buscar Tipo de Cambio</Dialog.Title>
        <Dialog.Content>
          <MonedaSelector
            selectedMoneda={selectedOption}
            onMonedaChange={handleOptionChange}
          />
          <DatePickerSearchBar
            value={fechaSelected}
            onSelect={(date) => {
              setFechaSelected(moment(date).format("YYYY-MM-DD"));
            }}
            onClear={() => setFechaSelected(null)}
            placeholder="Fecha"
          />
          <View style={{ marginTop: 20 }}>
            {Object.keys(filteredCambio).map((key) => (
              <View
                key={key}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  marginBottom: 10,
                }}
              >
                <Text style={{ fontWeight: "bold", color: theme.colors.primary }}>
                  {key.toUpperCase().replace(/([A-Z]{3})([A-Z]{3})/, "$1-$2")}:
                </Text>
                <Text style={{ color: theme.colors.primary }}>{filteredCambio[key] || "N/A"}</Text>
              </View>
            ))}
          </View>
        </Dialog.Content>
        <Dialog.Actions
          style={{
            justifyContent: 'flex-start'
          }}
        >
          <Icon.Button
            backgroundColor={theme.colors.white}
            color={theme.colors.primary}
            name={"keyboard-backspace"}
            onPress={() => setVisible(false)}
            style={{
              paddingHorizontal: 25,
            }}
          />
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default CambioFechaDialog;