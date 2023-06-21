const Canvas2x2Component = {
    props: ['modelValue', 'x', 'y', 'width', 'height', 'itemKey', 'itemText'],
    // emits: ['update:modelValue'],
    computed: {
        items: {
            get() {
                return this.modelValue
            },
            set(value) {
                this.$emit('update:modelValue', value)
            }
        }
    },
    watch: {
        modelValue: {
            handler(newModelValue) {
                this.refreshNotes()
            },
            deep: true
        },
    },
    template: `
        <div>
            <canvas style="border: 1px solid black;"></canvas>
        </div>
    `,
    data() {
        return {
            canvas: null,
            notes: [], // sync this.items with this.notes
        }
    },
    methods: {
        addItem(item) {
            const group = this.createNote(item[this.itemText])

            if (item.left && item.top) {
                group.set("left", item.left);
                group.set("top", item.top);
            } else {
                this.canvas.centerObject(group);
            }

            this.notes.push(group);

            /*** Set external id */
            group.set("ext", {id: item[this.itemKey]});

            /*** MouseUp Event Listener */
            group.on("mouseup", this._mouseUpListener)

            this.canvas.add(group);
        },
        _mouseUpListener(event) {
            const {top, left} = event.currentTarget;

            const payload = {
                id: event.currentTarget.ext.id, 
                left, 
                top
            };

            this.$emit("move", payload);
        },
        refreshNotes() {
            this.notes.forEach(x => this.canvas.remove(x))
            this.notes = []
            this.items.forEach(x => this.addItem(x))
        },
        createNote(txt) {
            let text = new fabric.Text(txt, {
                // textBackgroundColor: '#fffaaa',
                fontSize: 12,
                originX: 'center',
                originY: 'center',
                width: 50,
                breakWords: true,
            });
            let bg = new fabric.Rect({
                // left: 100,
                // top: 100,
                fill: '#fffaaa',
                width: text.width + 15,
                height: text.height + 30,
                rx: 5,
                ry: 5,
                scaleY: 0.5,
                originX: 'center',
                originY: 'center',
            });

            let group = new fabric.Group([bg, text], {
                hasBorders: false,
                hasControls: false,
                // lockRotation: true,
                // lockScalingX: true,
                // lockScalingY: true,
            });

            return group
        },
        setupCanvas() {
            const canv = this.$el.querySelector("canvas");

            this.canvas = new fabric.Canvas(canv, {
                width: this.width,
                height: this.height,
            });

            const padding = 5;

            const axisOpts = {
                stroke: 'rgba(0,0,0,1)',
                strokeWidth: 1,
                // lockScalingX: true,
                // lockScalingY: true,
                // lockRotation: true,
                hasControls: false,
                hasBorders: false,
                lockMovementX: true,
                lockMovementY: true,
                zIndex: -999,
            };

            let xAxis = new fabric.Line([0, this.height/2, this.width, this.height/2], axisOpts);
            this.canvas.add(xAxis);

            let yAxis = new fabric.Line([this.width/2, 0, this.width/2, this.height], axisOpts);
            this.canvas.add(yAxis);

            let yAxisName = new fabric.Text("High " + this.y, {
                fontSize: 12,
                fontFamily: 'Calibri',
                fontWeight: 100,
                originY: 'bottom',
                left: this.width/2 + padding,
                top: 0 + padding,
                angle: 90,
                lockMovementX: true,
                lockMovementY: true,
            })
            this.canvas.add(yAxisName);

            let xAxisName = new fabric.Text("High " + this.x, {
                fontSize: 12,
                fontFamily: 'Calibri',
                fontWeight: 100,
                originX: 'right',
                left: this.width - padding,
                top: this.height/2 + padding,
                lockMovementX: true,
                lockMovementY: true,
            })
            this.canvas.add(xAxisName);
        }
    },
    mounted() {
        this.setupCanvas()

        this.refreshNotes()
    },
};


export default Canvas2x2Component;
