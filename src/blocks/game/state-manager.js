import { setStateAndIgnoreObservers } from '../../state';
import { createEmptyBoard, createRandomShape } from '../utils';

import {
    cancelAnimationFrame,
    requestAnimationFrame,
} from '../../web-api-polyfills';

import draw from './draw';
import logic from './logic';

import {
    BLOCKS_GAME_PAUSE,
    BLOCKS_GAME_PLAYING,
    BLOCKS_GAME_INITIAL,
    BLOCKS_GAME_OVER,
} from '../../state/consts';


/**
 * This method is being called on each state update.
 * Core game state management logic.
 * Use here only `setStateAndIgnoreObservers` so it won't enter endless loop.
 * @param {Object} state Current state.
 */
const gameStateMachine = (state) => {
    const {
        rows,
        columns,
        gameState,
        animationId,
        gameLogicId,
        gameLogicTimeoutId,
    } = state;

    switch (gameState) {
    case BLOCKS_GAME_INITIAL:
        // initialize game
        setStateAndIgnoreObservers({
            nextShape: createRandomShape(columns),
            currentShape: createRandomShape(columns),
            gameBoard: createEmptyBoard(columns, rows),
        });
        break;
    case BLOCKS_GAME_PLAYING:
        // start animations and logic loops
        requestAnimationFrame(draw);
        requestAnimationFrame(logic);
        break;
    case BLOCKS_GAME_PAUSE:
        cancelAnimationFrame(animationId);
        cancelAnimationFrame(gameLogicId);
        clearInterval(gameLogicTimeoutId);
        // game logic loop end is being handled inside logic method itself
        setStateAndIgnoreObservers({
            animationId: null,
            gameLogicId: null,
            gameLogicTimeoutId: null,
        });
        break;
    case BLOCKS_GAME_OVER:
        // TODO handle game over
        break;
    default:
        // should not be here
        throw new Error(`Unsupported game state: ${gameState}`);
    }
};

export default gameStateMachine;
