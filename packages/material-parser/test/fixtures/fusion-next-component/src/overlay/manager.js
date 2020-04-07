const overlayManager = {
    allOverlays: [],

    addOverlay(overlay) {
        this.removeOverlay(overlay);
        this.allOverlays.unshift(overlay);
    },

    isCurrentOverlay(overlay) {
        return overlay && this.allOverlays[0] === overlay;
    },

    removeOverlay(overlay) {
        const i = this.allOverlays.indexOf(overlay);
        if (i > -1) {
            this.allOverlays.splice(i, 1);
        }
    },
};

export default overlayManager;
