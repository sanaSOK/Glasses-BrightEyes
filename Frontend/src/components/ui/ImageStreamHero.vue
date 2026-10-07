<script setup lang="ts">
import { computed, useId } from 'vue';

export type CorridorPath = {
  perspective?: number;
  cardWidth?: number;
  cardHeight?: number;
  cardRadius?: number;
  birthHeight?: number;
  exitHeight?: number;
  railBirth?: number;
  railExit?: number;
  fan?: number;
  turnBirth?: number;
  turnExit?: number;
  stops?: number;
};

export type StreamImage = {
  src: string;
  alt?: string;
};

const PATH: Required<CorridorPath> = {
  perspective: 30,
  cardWidth: 18,
  cardHeight: 25,
  cardRadius: 0.4,
  birthHeight: 2.6,
  exitHeight: 46,
  railBirth: -11,
  railExit: 44,
  fan: 3.3,
  turnBirth: 6,
  turnExit: 28,
  stops: 24,
};

function keyframes(dir: 1 | -1, name: string, p: Required<CorridorPath>) {
  const steps: string[] = [];
  for (let s = 0; s <= p.stops; s++) {
    const u = s / p.stops;
    const scale =
      (p.birthHeight / p.cardHeight) *
      Math.pow(p.exitHeight / p.birthHeight, u);
    const z = p.perspective * (1 - 1 / scale);
    const rail =
      p.railExit - (p.railExit - p.railBirth) * Math.pow(1 - u, p.fan);
    const turn = p.turnBirth + (p.turnExit - p.turnBirth) * u;
    steps.push(
      `${(u * 100).toFixed(2)}%{transform:translate3d(${(dir * rail).toFixed(
        2,
      )}cqw,0,${z.toFixed(2)}cqw) rotateY(${(-dir * turn).toFixed(2)}deg)}`,
    );
  }
  return `@keyframes ${name}{${steps.join("")}}`;
}

const props = withDefaults(
  defineProps<{
    images: StreamImage[];
    cards?: number;
    speed?: number;
    axis?: number;
    path?: CorridorPath;
    className?: string;
  }>(),
  {
    cards: 9,
    speed: 18,
    axis: 55,
    className: '',
  }
);

const rawId = typeof useId === 'function' ? useId() : Math.random().toString(36).substring(2, 9);
const id = String(rawId).replace(/[^a-zA-Z0-9]/g, "");
const right = `ish-r-${id}`;
const left = `ish-l-${id}`;
const cardClass = `ish-c-${id}`;

const p = computed(() => ({ ...PATH, ...props.path }));

const css = computed(
  () =>
    `${keyframes(1, right, p.value)}${keyframes(-1, left, p.value)}` +
    `@media(prefers-reduced-motion:reduce){.${cardClass}{animation-play-state:paused}}`
);
</script>

<template>
  <div
    :class="['relative overflow-hidden', className]"
    style="container-type: inline-size"
  >
    <component :is="'style'">{{ css }}</component>

    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0"
      :style="{
        perspective: `${p.perspective}cqw`,
        perspectiveOrigin: `50% ${axis}%`,
      }"
    >
      <div
        class="absolute inset-0"
        style="transform-style: preserve-3d"
      >
        <template v-for="name in [right, left]" :key="name">
          <div
            v-for="i in cards"
            :key="`${name}-${i}`"
            :class="[cardClass, 'absolute overflow-hidden']"
            :style="{
              left: '50%',
              top: `${axis}%`,
              width: `${p.cardWidth}cqw`,
              height: `${p.cardHeight}cqw`,
              marginLeft: `${-p.cardWidth / 2}cqw`,
              marginTop: `${-p.cardHeight / 2}cqw`,
              borderRadius: `${p.cardRadius}cqw`,
              animation: `${name} ${speed}s linear infinite`,
              animationDelay: `${-((i - 1) * speed) / cards}s`,
              backfaceVisibility: 'hidden',
            }"
          >
            <img
              v-if="images[(i - 1) % Math.max(images.length, 1)]"
              :src="images[(i - 1) % Math.max(images.length, 1)].src"
              :alt="images[(i - 1) % Math.max(images.length, 1)].alt || ''"
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover"
              :draggable="false"
            />
          </div>
        </template>
      </div>
    </div>

    <slot />
  </div>
</template>
