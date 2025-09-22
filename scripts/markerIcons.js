/**
 * Function to get the color corresponding to the easel easelBoardId value
 * @param {*} value The value to extract the easelBoardId from, e.g. 'B-01' or 'BC-02'
 * @returns color The color corresponding to the easelBoardId value
 */
function getColorByEaselBoardId(value) {
  let easelBoardId = value.split("-")[0]; // Extract the easelBoardId
  let color;
  switch (easelBoardId) {
    case "B":
      color = "#008000"; // green (B-1 through B-7)
      break;
    case "BCS":
      color = "#FFA500"; // orange (BCS-1, BCS-2, BCS-3)
      break;
    case "BHC":
      color = "#008000"; // green (Biology, Hixon Center - follows Biology color)
      break;
    case "C":
      color = "#FF0000"; // red (C-1 through C-17)
      break;
    case "CEP":
      color = "#FFA500"; // orange (CEP1 & CEP2)
      break;
    case "CHC":
      color = "#FFA500"; // orange (CHC1, CHC2, CHC3)
      break;
    case "CP":
      color = "#FFA500"; // orange (CP1)
      break;
    case "CS":
      color = "#87CEEB"; // light blue (CS-1 through CS-22)
      break;
    case "CSE":
      color = "#FFA500"; // orange (CSE-1, CSE-2)
      break;
    case "CSEM":
      color = "#FFA500"; // orange (CSEM-1)
      break;
    case "CSEP":
      color = "#FFA500"; // orange (CSEP-1, CSEP-2)
      break;
    case "CSHC":
      color = "#FFA500"; // orange (CSHC-1, CSHC-2)
      break;
    case "CSM":
      color = "#FFA500"; // orange (CSM-1)
      break;
    case "E":
      color = "#000000"; // black (E-1 through E-26)
      break;
    case "EP":
      color = "#FFA500"; // orange (EP-1)
      break;
    case "HC":
      color = "#FFD700"; // gold (HC-1)
      break;
    case "HSA":
      color = "#008080"; // teal (HSA-1)
      break;
    case "HSAM":
      color = "#FFA500"; // orange (HSAM-1)
      break;
    case "M":
      color = "#FFA500"; // orange (M-1 through M-5)
      break;
    case "P":
      color = "#800080"; // purple (P-1 through P-13)
      break;
    // Legacy cases for backward compatibility
    case "BC":
      color = "#56B4E9"; // light blue (legacy)
      break;
    case "BE":
      color = "#F0E442"; // light yellow (legacy)
      break;
    case "CSN":
      color = "#009E73"; // teal (legacy)
      break;
    case "EM":
      color = "#FF4500"; // orange-red (legacy)
      break;
    case "O":
      color = "#CC79A7"; // pink (legacy)
      break;
    case "SSEF":
      color = "#E69F00"; // yellow-orange (legacy)
      break;
    default:
      color = "#000000"; // black for unrecognized easelBoardId
  }

  return color;
}

/**
 * Returns a shape based on the easelBoardId value
 * @param {*} value
 * @returns shape The shape corresponding to the easelBoardId value
 */
function getShapeByEaselBoardId(value) {
  let easelBoardId = value.split("-")[0]; // Extract the easelBoardId
  let shape = '<circle cx="12" cy="12" r="10"  />'; // Circle
  return shape;
}

/**
 * Creates a custom icon based on easelBoardId
 * @param {*} easelBoardId The easelBoardId value to get the color for
 * @param {*} size The size of the icon
 * @returns
 */
function getCustomIcon(easelBoardId, size) {
  const color = getColorByEaselBoardId(easelBoardId);
  const shape = getShapeByEaselBoardId(easelBoardId);
  const svgIcon = L.divIcon({
    className: "custom-div-icon",
    html: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
                ${shape}
               </svg>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size * 1.64], // Adjust popup anchor proportionally
  });

  return svgIcon;
}

export { getCustomIcon, getColorByEaselBoardId, getShapeByEaselBoardId };
