/**
 * Created by xiachi on 17/1/17.
 */

var normalMap = {
    t: {
        align: 'bc tc',
        rtlAlign: 'bc tc',
        arrow: 'bottom',
        trOrigin: 'bottom',
        rtlTrOrigin: 'bottom',
        offset: [0, -12]
    },
    r: {
        align: 'cl cr',
        rtlAlign: 'cr cl',
        arrow: 'left',
        trOrigin: 'left',
        rtlTrOrigin: 'right',
        offset: [12, 0]
    },
    b: {
        align: 'tc bc',
        rtlAlign: 'tc bc',
        arrow: 'top',
        trOrigin: 'top',
        rtlTrOrigin: 'top',
        offset: [0, 12]
    },
    l: {
        align: 'cr cl',
        rtlAlign: 'cl cr',
        arrow: 'right',
        trOrigin: 'right',
        rtlTrOrigin: 'left',
        offset: [-12, 0]
    },
    tl: {
        align: 'br tc',
        rtlAlign: 'bl tc',
        arrow: 'bottom-right',
        trOrigin: 'bottom right',
        rtlTrOrigin: 'bottom left',
        offset: [20, -12]
    },
    tr: {
        align: 'bl tc',
        rtlAlign: 'br tc',
        arrow: 'bottom-left',
        trOrigin: 'bottom left',
        rtlTrOrigin: 'bottom right',
        offset: [-20, -12]
    },
    rt: {
        align: 'bl cr',
        rtlAlign: 'br cl',
        arrow: 'left-bottom',
        trOrigin: 'bottom left',
        rtlTrOrigin: 'bottom right',
        offset: [12, 20]
    },
    rb: {
        align: 'tl cr',
        rtlAlign: 'tr cl',
        arrow: 'left-top',
        trOrigin: 'top left',
        rtlTrOrigin: 'top right',
        offset: [12, -20]
    },
    bl: {
        align: 'tr bc',
        rtlAlign: 'tl bc',
        arrow: 'top-right',
        trOrigin: 'top right',
        rtlTrOrigin: 'top left',
        offset: [20, 12]
    },
    br: {
        align: 'tl bc',
        rtlAlign: 'tr bc',
        arrow: 'top-left',
        trOrigin: 'top left',
        rtlTrOrigin: 'top right',
        offset: [-20, 12]
    },
    lt: {
        align: 'br cl',
        rtlAlign: 'bl cr',
        arrow: 'right-bottom',
        trOrigin: 'bottom right',
        rtlTrOrigin: 'bottom left',
        offset: [-12, 20]
    },
    lb: {
        align: 'tr cl',
        rtlAlign: 'tl cr',
        arrow: 'right-top',
        trOrigin: 'top right',
        rtlTrOrigin: 'top left',
        offset: [-12, -20]
    }
};
var edgeMap = {
    t: {
        align: 'bc tc',
        rtlAlign: 'bc tc',
        arrow: 'bottom',
        trOrigin: 'bottom',
        rtlTrOrigin: 'bottom',
        offset: [0, -12]
    },
    r: {
        align: 'cl cr',
        rtlAlign: 'cr cl',
        arrow: 'left',
        trOrigin: 'left',
        rtlTrOrigin: 'right',
        offset: [12, 0]
    },
    b: {
        align: 'tc bc',
        rtlAlign: 'tc bc',
        arrow: 'top',
        trOrigin: 'top',
        rtlTrOrigin: 'top',
        offset: [0, 12]
    },
    l: {
        align: 'cr cl',
        rtlAlign: 'cl cr',
        arrow: 'right',
        trOrigin: 'right',
        rtlTrOrigin: 'left',
        offset: [-12, 0]
    },
    tl: {
        align: 'bl tl',
        rtlAlign: 'br tr',
        arrow: 'bottom-left',
        trOrigin: 'bottom left',
        rtlTrOrigin: 'bottom right',
        offset: [0, -12]
    },
    tr: {
        align: 'br tr',
        rtlAlign: 'bl tl',
        arrow: 'bottom-right',
        trOrigin: 'bottom right',
        rtlTrOrigin: 'bottom left',
        offset: [0, -12]
    },
    rt: {
        align: 'tl tr',
        rtlAlign: 'tr tl',
        arrow: 'left-top',
        trOrigin: 'top left',
        rtlTrOrigin: 'top right',
        offset: [12, 0]
    },
    rb: {
        align: 'bl br',
        rtlAlign: 'br bl',
        arrow: 'left-bottom',
        trOrigin: 'bottom left',
        rtlTrOrigin: 'bottom right',
        offset: [12, 0]
    },
    bl: {
        align: 'tl bl',
        rtlAlign: 'tr br',
        arrow: 'top-left',
        trOrigin: 'top left',
        rtlTrOrigin: 'top right',
        offset: [0, 12]
    },
    br: {
        align: 'tr br',
        rtlAlign: 'tl bl',
        arrow: 'top-right',
        trOrigin: 'top right',
        rtlTrOrigin: 'top left',
        offset: [0, 12]
    },
    lt: {
        align: 'tr tl',
        rtlAlign: 'tl tr',
        arrow: 'right-top',
        trOrigin: 'top right',
        rtlTrOrigin: 'top left',
        offset: [-12, 0]
    },
    lb: {
        align: 'br bl',
        rtlAlign: 'bl br',
        arrow: 'right-bottom',
        trOrigin: 'bottom right',
        rtlTrOrigin: 'bottom left',
        offset: [-12, 0]
    }
};

export { normalMap, edgeMap };