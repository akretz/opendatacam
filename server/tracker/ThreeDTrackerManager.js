const { Tracker } = require('3d-vehicles');

class ThreeDTrackerManager {
  constructor(camera) {
    this.camera = camera;
    this.trackers = new Map();
  }

  update(data, frameNb) {
    let tracker;

    if (this.trackers.has(data.id)) {
      tracker = this.trackers.get(data.id).tracker;
      this.trackers.get(data.id).lastFrameNb = frameNb;
    } else {
      tracker = new Tracker(this.camera);
      this.trackers.set(data.id, {
        tracker,
        lastFrameNb: frameNb,
      });
    }

    data['3d'] = tracker.update(frameNb, {
      x: data.x - data.w / 2,
      y: data.y - data.h / 2,
      width: data.w,
      height: data.h,
    });
  }

  removeOldTrackers(frameNb, maxAge) {
    for (const [id, { lastFrameNb }] of this.trackers.entries()) {
      if (lastFrameNb < frameNb - maxAge) {
        this.trackers.delete(id);
      }
    }
  }

  updateStates(trackerData, frameNb) {
    this.removeOldTrackers(frameNb, 100);

    trackerData
      .forEach((d) => this.update(d, frameNb));
  }
}

module.exports = ThreeDTrackerManager;
