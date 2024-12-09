<template>
  <div v-html="renderedContent"></div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { marked } from 'marked';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const props = defineProps<{
  content: string;
}>();

// Custom renderer for math blocks
const renderer = new marked.Renderer();
const originalCodeRenderer = renderer.code.bind(renderer);

renderer.code = (code, language) => {
  if (language === 'math') {
    try {
      return katex.renderToString(code, {
        throwOnError: false,
        displayMode: true
      });
    } catch (error) {
      console.error('KaTeX rendering error:', error);
      return code;
    }
  }
  return originalCodeRenderer(code, language);
};

// Process inline math expressions between $...$ 
const processInlineMath = (text: string) => {
  return text.replace(/\$([^\$]+)\$/g, (match, formula) => {
    try {
      return katex.renderToString(formula, {
        throwOnError: false,
        displayMode: false
      });
    } catch (error) {
      console.error('KaTeX rendering error:', error);
      return match;
    }
  });
};

const renderedContent = computed(() => {
  let processed = marked(props.content, { renderer });
  processed = processInlineMath(processed);
  return processed;
});

onMounted(() => {
  marked.setOptions({
    gfm: true,
    breaks: true,
    sanitize: false
  });
});
</script>

<style>
.katex-display {
  margin: 1em 0;
  overflow-x: auto;
  overflow-y: hidden;
}
</style>
