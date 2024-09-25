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
      color = "#E69F00"; // yellow-orange
      break;
    case "BC":
      color = "#56B4E9"; // light blue
      break;
    case "BCS":
      color = "#009E73"; // teal
      break;
    case "BE":
      color = "#F0E442"; // light yellow
      break;
    case "C":
      color = "#0072B2"; // dark blue
      break;
    case "CEP":
      color = "#D55E00"; // orange
      break;
    case "CHC":
      color = "#CC79A7"; // pink
      break;
    case "CS":
      color = "#FF69B4"; // hot pink
      break;
    case "CSHC":
      color = "#E69F00"; // yellow-orange
      break;
    case "CSM":
      color = "#56B4E9"; // light blue
      break;
    case "CSN":
      color = "#009E73"; // teal
      break;
    case "E":
      color = "#0072B2"; // dark blue
      break;
    case "EM":
      color = "#FF4500"; // orange-red
      break;
    case "M":
      color = "#D55E00"; // orange
      break;
    case "O":
      color = "#CC79A7"; // pink
      break;
    case "P":
      color = "#FFD700"; // gold
      break;
    case "SSEF":
      color = "#E69F00"; // yellow-orange
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
