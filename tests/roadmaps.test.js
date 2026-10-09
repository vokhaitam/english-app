import { describe, it, expect } from 'vitest';
import { roadmaps, getRoadmap } from '../src/data/roadmaps';
import { jaRoadmaps, getJaRoadmap } from '../src/data/ja-roadmaps';
import { topics } from '../src/data/vocabulary';
import jaPack from '../src/data/ja';

const topicIds = new Set(topics.map(t => t.id));

describe('roadmaps data', () => {
  it('has 2 roadmaps with unique ids', () => {
    expect(roadmaps.length).toBe(2);
    const ids = roadmaps.map(r => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(expect.arrayContaining(['toeic', 'ielts']));
  });

  it('every roadmap has display fields', () => {
    for (const rm of roadmaps) {
      expect(rm.name, rm.id).toBeTruthy();
      expect(rm.icon, rm.id).toBeTruthy();
      expect(rm.target, rm.id).toBeTruthy();
      expect(rm.desc, rm.id).toBeTruthy();
      expect(rm.gradient, rm.id).toContain('gradient');
    }
  });

  it('every roadmap has stages with unique ids and display fields', () => {
    for (const rm of roadmaps) {
      expect(rm.stages.length, rm.id).toBeGreaterThanOrEqual(3);
      const ids = rm.stages.map(s => s.id);
      expect(new Set(ids).size, `${rm.id} stage ids`).toBe(ids.length);
      for (const st of rm.stages) {
        expect(st.title, st.id).toBeTruthy();
        expect(st.target, st.id).toBeTruthy();
        expect(st.desc, st.id).toBeTruthy();
        expect(st.topics.length, st.id).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it('every topic referenced by a roadmap exists in vocabulary data', () => {
    for (const rm of roadmaps) {
      for (const st of rm.stages) {
        for (const t of st.topics) {
          expect(topicIds.has(t), `${rm.id}/${st.id} references unknown topic ${t}`).toBe(true);
        }
      }
    }
  });

  it('roadmaps cover every topic at least once', () => {
    const used = new Set();
    for (const rm of roadmaps) {
      for (const st of rm.stages) for (const t of st.topics) used.add(t);
    }
    for (const id of topicIds) {
      expect(used.has(id), `topic ${id} not covered by any roadmap`).toBe(true);
    }
  });

  it('getRoadmap finds by id and returns null otherwise', () => {
    expect(getRoadmap('toeic')?.stages.length).toBe(5);
    expect(getRoadmap('ielts')?.stages.length).toBe(6);
    expect(getRoadmap('nope')).toBeNull();
    expect(getRoadmap()).toBeNull();
  });
});

describe('jlpt roadmaps data', () => {
  const jaTopicIds = new Set(jaPack.topics.map(t => t.id));

  it('has 3 roadmaps with unique ids and display fields', () => {
    expect(jaRoadmaps.length).toBe(3);
    const ids = jaRoadmaps.map(r => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(expect.arrayContaining(['jlpt-n5', 'jlpt-n4', 'jlpt-n3']));
    for (const rm of jaRoadmaps) {
      expect(rm.name, rm.id).toBeTruthy();
      expect(rm.icon, rm.id).toBeTruthy();
      expect(rm.target, rm.id).toBeTruthy();
      expect(rm.desc, rm.id).toBeTruthy();
      expect(rm.gradient, rm.id).toContain('gradient');
    }
  });

  it('every stage has unique ids, display fields and at least 2 topics', () => {
    for (const rm of jaRoadmaps) {
      expect(rm.stages.length, rm.id).toBeGreaterThanOrEqual(2);
      const ids = rm.stages.map(s => s.id);
      expect(new Set(ids).size, `${rm.id} stage ids`).toBe(ids.length);
      for (const st of rm.stages) {
        expect(st.title, st.id).toBeTruthy();
        expect(st.target, st.id).toBeTruthy();
        expect(st.desc, st.id).toBeTruthy();
        expect(st.topics.length, st.id).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('every referenced topic exists in the japanese pack', () => {
    for (const rm of jaRoadmaps) {
      for (const st of rm.stages) {
        for (const t of st.topics) {
          expect(jaTopicIds.has(t), `${rm.id}/${st.id} references unknown topic ${t}`).toBe(true);
        }
      }
    }
  });

  it('jlpt roadmaps cover every japanese topic at least once', () => {
    const used = new Set();
    for (const rm of jaRoadmaps) {
      for (const st of rm.stages) for (const t of st.topics) used.add(t);
    }
    for (const id of jaTopicIds) {
      expect(used.has(id), `topic ${id} not covered by any jlpt roadmap`).toBe(true);
    }
  });

  it('getJaRoadmap finds by id and returns null otherwise', () => {
    expect(getJaRoadmap('jlpt-n5')?.stages.length).toBe(3);
    expect(getJaRoadmap('jlpt-n4')?.stages.length).toBe(3);
    expect(getJaRoadmap('jlpt-n3')?.stages.length).toBe(2);
    expect(getJaRoadmap('nope')).toBeNull();
    expect(getJaRoadmap()).toBeNull();
  });
});
