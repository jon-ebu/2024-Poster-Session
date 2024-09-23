/**
 * Function to get the color corresponding to the easel easelBoardId value
 * @param {*} value The value to extract the easelBoardId from, e.g. 'B-01' or 'BC-02'
 * @returns color The color corresponding to the easelBoardId value
 */
function getColorByEaselBoardId(value) {
    let easelBoardId = value.split('-')[0]; // Extract the easelBoardId
    let color;
    switch (easelBoardId) {
        case 'B':
            color = '#E69F00'; // orange
            break;
        case 'BC':
            color = '#56B4E9'; // sky blue
            break;
        case 'BCS':
            color = '#009E73'; // bluish green
            break;
        case 'BE':
            color = '#F0E442'; // yellow
            break;
        case 'C':
            color = '#0072B2'; // blue
            break;
        case 'CEP':
            color = '#D55E00'; // vermillion
            break;
        case 'CHC':
            color = '#CC79A7'; // reddish purple
            break;
        case 'CS':
            color = '#999999'; // gray
            break;
        case 'CSHC':
            color = '#E69F00'; // orange
            break;
        case 'CSM':
            color = '#56B4E9'; // sky blue
            break;
        case 'CSN':
            color = '#009E73'; // bluish green
            break;
        case 'E':
            color = '#0072B2'; // blue
            break;
        case 'EM':
            color = '#F0E442'; // yellow
            break;
        case 'M':
            color = '#D55E00'; // vermillion
            break;
        case 'O':
            color = '#CC79A7'; // reddish purple
            break;
        case 'P':
            color = '#999999'; // gray
            break;
        case 'SSEF':
            color = '#E69F00'; // orange
            break;
        default:
            color = '#000000'; // black for unrecognized easelBoardIdes
    }

    return color;
}

/**
 * Returns a shape based on the easelBoardId value
 * @param {*} value 
 * @returns shape The shape corresponding to the easelBoardId value
 */
function getShapeByEaselBoardId(value) {
    let easelBoardId = value.split('-')[0]; // Extract the easelBoardId
    let shape;

    switch (easelBoardId) {
        case 'B':
            shape = '<circle cx="12" cy="12" r="10"  />'; // Circle
            break;
        case 'BC':
            shape = '<rect x="4" y="4" width="16" height="16"  />'; // Square
            break;
        case 'BCS':
            shape = '<polygon points="12,2 22,22 2,22"  />'; // Triangle
            break;
        case 'BE':
            shape = '<circle cx="12" cy="12" r="10"  />'; // Circle
            break;
        case 'C':
            shape = '<rect x="4" y="4" width="16" height="16"  />'; // Square
            break;
        case 'CEP':
            shape = '<circle cx="12" cy="12" r="10"  />'; // Circle
            break;
        case 'CHC':
            shape = '<path d="M 2 2 L 22 2 L 12 22 Z"  />'; // Inverted Triangle
            break;
        case 'CS':
            shape = '<path d="M 12 2 L 22 22 L 2 22 Z"  />'; // Inverted Triangle (alternative)
            break;
        case 'CSHC':
            shape = '<rect x="4" y="4" width="16" height="16"  />'; // Square
            break;
        case 'CSM':
            shape = '<path d="M 12 2 L 22 22 L 2 22 Z"  />'; // Same Triangle
            break;
        case 'CSN':
            shape = '<circle cx="12" cy="12" r="5"  />'; // Smaller Circle
            break;
        case 'E':
            shape = '<circle cx="12" cy="12" r="10"  />'; // Circle; 
            break;
        case 'EM':
            shape = '<polygon points="12,2 22,22 2,22"  />'; // Triangle
            break;
        case 'M':
            shape = '<path d="M 2 2 L 22 2 L 12 22 Z"  />'; // Inverted Triangle
            break;
        case 'O':
            shape = '<circle cx="12" cy="12" r="10"  />'; // Circle
            break;
        case 'P':
            shape = '<circle cx="12" cy="12" r="10"  />'; // Circle
            break;
        case 'SSEF':
            shape = '<polygon points="12,2 22,22 2,22" />'; // Triangle (same as other triangles)
            break;
        default:
            shape = '<text x="2" y="12" >?</text>'; // Default shape (question mark)
    }

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
        className: 'custom-div-icon',
        html: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
                ${shape}
               </svg>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
    });

    return svgIcon;
}

export { getCustomIcon, getColorByEaselBoardId, getShapeByEaselBoardId };