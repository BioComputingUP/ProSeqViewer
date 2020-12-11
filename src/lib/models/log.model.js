class Log {
    static s(lvl) {
        Log.log = lvl;
    }
    static w(lvl, e) {
        if (lvl <= Log.log) {
            if (lvl === 1) {
                throw new Error(e);
            }
            else {
                console.warn(e);
            }
        }
    }
}
Log.log = 0;
exports.Log = Log;
