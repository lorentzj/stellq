// units moved per millisecond
const PLAYER_MOVE_SPEED = 0.0001;

export class PlayerState {
    x: number = 0;
    y: number = 0;

    currentInputData = {
        moveLeft: false,
        moveRight: false
    }

    constructor() {
        document.addEventListener("keydown", this.handleInputEvent.bind(this));
        document.addEventListener("keyup", this.handleInputEvent.bind(this));
    }

    update(deltaT: number) {
        if(this.currentInputData.moveLeft) {
            this.x -= PLAYER_MOVE_SPEED * deltaT;
        } else if(this.currentInputData.moveRight) {
            this.x += PLAYER_MOVE_SPEED * deltaT;
        }
        console.log(this.x, this.y);
    }

    handleInputEvent(event: KeyboardEvent) {
        if(event.type === "keyup") {
            if(event.key === "ArrowLeft") {
                this.currentInputData.moveLeft = false;
            } else if(event.key === "ArrowRight") {
                this.currentInputData.moveRight = false;
            }
        } else if(event.type === "keydown") {
            if(event.key === "ArrowLeft") {
                this.currentInputData.moveLeft = true;
                this.currentInputData.moveRight = false;
            } else if(event.key === "ArrowRight") {
                this.currentInputData.moveLeft = false;
                this.currentInputData.moveRight = true;
            }            
        }
    }
}