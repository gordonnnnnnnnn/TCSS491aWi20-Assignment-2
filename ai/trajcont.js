class TrajCont {
    constructor(size) {
        this.setSize(size);
        this._cont = [];
    }


    add(point) {
        if (this._size <= this._cont.length) {
            let n = [];
            for (let i = (this._cont.length - this._size) + 1; i < this._size; i++) {
                n.push(this._cont[i]);
            }
            this._cont = n;
        }
        this._cont.push(point);
    }

    setSize(size) {
        this._size = size;
    }

    clear() {
        this._cont = [];
    }

    get cont() {
        let n = [];
        for (let i = 0; i < this._cont.length; i++) {
            n.push(this._cont[i]);
        }
        return n;
    }
}