const BREAK = '^^'

export function withLineBreaks(content) {
    if (typeof content === "string" || content instanceof String) {
        let ret = content.replace(/<p><\/p>/g, "<br/>");
        return ret.replace(/<a/g, "<a target=\"_blank\" rel=\"noopener noreferrer\"");
    }
    return content;
}

export function videoUrl(url) {
    return url + "?enablejsapi=1&origin=https://14trees.org";
}

function whichCompoent(node) {
    let type = null;
    let small = false;
    switch(node?.data?.target?.sys?.contentType?.sys?.id) {
        case 'person':
            type = "person";
            small = true
            break;
        case 'articlePreview':
            type = "ArticlePreview";
            small = true
            break;
        case 'presentation':
            type = "SlideShow"
            break;
        default:
            undefined;
    }
    return {
        type,
        fields: (node?.data?.target?.fields),
        small
    }
}

export function composeTemplate(content, MARKS, BLOCKS, documentToHtmlString) {
    let componentMap = new Map();
    let componentInd = 0;
    const options = {
        // renderMark: {
            // [MARKS.BOLD]: text => `<custom-bold>${text}<custom-bold>`
        // },
        renderNode: {
            [BLOCKS.EMBEDDED_ENTRY]: (node) => {
                componentMap.set( componentInd, whichCompoent(node));
                componentInd += 1;
                return BREAK;
            }
        }
    }
    const compiled = documentToHtmlString(content, options);
    const splits = compiled.split(BREAK);
    const groups = new Array(); 
    for (let i = 0; i < splits.length; i ++) {
        groups.push({
            key: i, 
            split: splits[i].length > 0 ? splits[i] : null,
            component: componentMap.has(i) ? componentMap.get(i) : null 
        })
    }
    return groups;
}

export function toId(text) {
    return text.toLowerCase().replace(/\s/ig, "-");
}

export function imgSrc(img, width) {
    if (img?.file) 
        return `https:${img.file?.url}?w=${width}`;
    if (img?.fields?.file) 
        return `https:${img.fields?.file?.url}?w=${width}`;
    return null
}

export function parseTSV(tsv, full = false) {
    let dataMap = tsv.split('\n').map(row => row.split('\t'))
    let keys = dataMap.shift()
    dataMap = dataMap.map(row => {
        let returnMap = new Map()
        row.forEach((col, i) => returnMap.set(keys[i], col))
        return returnMap
    })
    if(full) {
        return dataMap
    }
    let shortMap = new Map()
    dataMap.forEach(row => shortMap.set(row.get("KeyA"), row.get("Value")))
    return shortMap
}

export const flattenToMap = (obj, map = new Map()) => {
    if (obj instanceof Map) {
        return obj
    }
    if (obj instanceof Object) {
        for (const key of Object.keys(obj)) {
            if (obj[key] instanceof Date) map.set(key, obj[key])
            if (obj[key] instanceof Object) {
                flattenToMap(obj[key], map)
            } else {
                map.set(key, obj[key])
            }
        }
    }
    return map
};