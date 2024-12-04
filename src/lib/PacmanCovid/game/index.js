import { orderPolarity } from './movement';
import { animateMonsters } from './monster';
import { animatePlayer } from './player';

function collectEatenMonsterScores(newState, oldState) {
    const scoreDelta = newState.monsters.reduce((sum, { deadTime }, index) =>
        sum + 1000 * ((deadTime > 0 && oldState.monsters[index].deadTime === 0) >> 0), 0);

    return { ...newState, score: newState.score + scoreDelta };
}

export function animate(state, { time = Date.now() } = {}) {
    // get the next game state as a function of time

    const timeSeconds = (time - state.stepTime) / 1000;

    if (state.lost) {
        return state;
    }

    const statePlayerAnimated = animatePlayer({ ...state, stepTime: time }, timeSeconds);

    const stateMonstersAnimated = animateMonsters(statePlayerAnimated, timeSeconds, state.player);

    const stateEatenMonsters = collectEatenMonsterScores(stateMonstersAnimated, state);

    return stateEatenMonsters;
}

export function changeDirection(state, { direction, gestureConfirmed }) {
    if (!gestureConfirmed) {
        console.log("Gesture not confirmed. Ignoring direction change.");
        return state;
    }
    
    const delayedDirection = direction;
    const orderPolarityOld = orderPolarity(state.player.direction);
    const orderPolarityNew = orderPolarity(direction);

    if (orderPolarityOld.plane === orderPolarityNew.plane) {
        return {
            ...state,
            player: {
                ...state.player,
                direction: delayedDirection,
                nextDirection: delayedDirection
            }
        };
    }

    return {
        ...state,
        player: {
            ...state.player,
            nextDirection: delayedDirection
        }
    };
}

