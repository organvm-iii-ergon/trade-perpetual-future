import { describe, it, expect } from 'vitest';
import { createLocalGameAdapter, createOnChainGameAdapter } from './game-adapter';
import type { Game } from '@/types';

function makeGameStore() {
  let games: Game[] = [];
  let balance = 1000;
  return {
    getGames: () => games,
    setGames: (updater: (prev: Game[]) => Game[]) => { games = updater(games); },
    getBalance: () => balance,
    setBalance: (updater: (prev: number) => number) => { balance = updater(balance); },
    get games() { return games; },
    get balance() { return balance; },
  };
}

describe('createLocalGameAdapter', () => {
  it('has mode "local"', () => {
    const store = makeGameStore();
    const adapter = createLocalGameAdapter(store.getGames, store.setGames, store.getBalance, store.setBalance);
    expect(adapter.mode).toBe('local');
  });

  describe('createGame', () => {
    it('creates a game and deducts wager', async () => {
      const store = makeGameStore();
      const adapter = createLocalGameAdapter(store.getGames, store.setGames, store.getBalance, store.setBalance);
      const game = await adapter.createGame('dice', 100, 'user1');
      expect(game.type).toBe('dice');
      expect(game.wager).toBe(100);
      expect(game.creatorId).toBe('user1');
      expect(game.status).toBe('waiting');
      expect(store.balance).toBe(900);
      expect(store.games).toHaveLength(1);
    });

    it('throws when wager exceeds balance', async () => {
      const store = makeGameStore();
      const adapter = createLocalGameAdapter(store.getGames, store.setGames, store.getBalance, store.setBalance);
      await expect(adapter.createGame('dice', 2000, 'user1')).rejects.toThrow('Insufficient balance');
    });
  });

  describe('joinGame', () => {
    it('resolves a game and returns result', async () => {
      const store = makeGameStore();
      const adapter = createLocalGameAdapter(store.getGames, store.setGames, store.getBalance, store.setBalance);
      const game = await adapter.createGame('coinflip', 100, 'creator');

      const result = await adapter.joinGame(game.id, 'opponent', store.games);
      expect(result.game.status).toBe('completed');
      expect(result.game.opponentId).toBe('opponent');
      expect(typeof result.won).toBe('boolean');
      expect(typeof result.payout).toBe('number');
    });

    it('throws for non-existent game', async () => {
      const store = makeGameStore();
      const adapter = createLocalGameAdapter(store.getGames, store.setGames, store.getBalance, store.setBalance);
      await expect(adapter.joinGame('fake-id', 'user', [])).rejects.toThrow('Game not found');
    });

    it('throws when opponent balance insufficient', async () => {
      const store = makeGameStore();
      const adapter = createLocalGameAdapter(store.getGames, store.setGames, store.getBalance, store.setBalance);
      const game = await adapter.createGame('dice', 500, 'creator');
      // Balance is now 500; need 500 more to join
      store.setBalance(() => 100); // set balance to 100
      await expect(adapter.joinGame(game.id, 'opponent', store.games)).rejects.toThrow('Insufficient balance');
    });
  });

  describe('cancelGame', () => {
    it('cancels a waiting game and refunds wager', async () => {
      const store = makeGameStore();
      const adapter = createLocalGameAdapter(store.getGames, store.setGames, store.getBalance, store.setBalance);
      const game = await adapter.createGame('dice', 200, 'user1');
      expect(store.balance).toBe(800);

      const cancelled = await adapter.cancelGame(game.id, store.games);
      expect(cancelled.status).toBe('cancelled');
      expect(store.balance).toBe(1000);
    });

    it('throws for non-existent game', async () => {
      const store = makeGameStore();
      const adapter = createLocalGameAdapter(store.getGames, store.setGames, store.getBalance, store.setBalance);
      await expect(adapter.cancelGame('fake', [])).rejects.toThrow('Game not found');
    });

    it('throws when game is not in waiting status', async () => {
      const store = makeGameStore();
      const adapter = createLocalGameAdapter(store.getGames, store.setGames, store.getBalance, store.setBalance);
      const game = await adapter.createGame('coinflip', 100, 'creator');
      // Join the game first to make it completed
      await adapter.joinGame(game.id, 'opponent', store.games);
      await expect(adapter.cancelGame(game.id, store.games)).rejects.toThrow('Cannot cancel active game');
    });
  });

  describe('getGames', () => {
    it('returns current games', async () => {
      const store = makeGameStore();
      const adapter = createLocalGameAdapter(store.getGames, store.setGames, store.getBalance, store.setBalance);
      await adapter.createGame('dice', 50, 'user1');
      await adapter.createGame('coinflip', 75, 'user1');
      const games = await adapter.getGames();
      expect(games).toHaveLength(2);
    });
  });
});

describe('createOnChainGameAdapter', () => {
  it('has mode "on-chain"', () => {
    const adapter = createOnChainGameAdapter();
    expect(adapter.mode).toBe('on-chain');
  });

  it('throws on createGame', async () => {
    const adapter = createOnChainGameAdapter();
    await expect(adapter.createGame('dice', 100, 'user')).rejects.toThrow('not yet deployed');
  });

  it('throws on joinGame', async () => {
    const adapter = createOnChainGameAdapter();
    await expect(adapter.joinGame('id', 'user')).rejects.toThrow('not yet deployed');
  });

  it('throws on cancelGame', async () => {
    const adapter = createOnChainGameAdapter();
    await expect(adapter.cancelGame('id')).rejects.toThrow('not yet deployed');
  });

  it('returns empty array for getGames', async () => {
    const adapter = createOnChainGameAdapter();
    const games = await adapter.getGames();
    expect(games).toEqual([]);
  });
});
