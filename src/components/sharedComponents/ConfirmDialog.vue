<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: 'Confirm Action',
  },
  message: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: 'warning', // 'warning', 'info', 'danger'
  },
  confirmText: {
    type: String,
    default: 'Proceed',
  },
  cancelText: {
    type: String,
    default: 'Cancel',
  },
  confirmVariant: {
    type: String,
    default: 'danger', // 'danger', 'primary'
  },
});

const emit = defineEmits(['confirm', 'cancel', 'close']);

const handleConfirm = () => {
  emit('confirm');
  emit('close');
};

const handleCancel = () => {
  emit('cancel');
  emit('close');
};

const handleBackdropClick = () => {
  emit('cancel');
  emit('close');
};
</script>

<template>
  <Transition name="dialog">
    <div v-if="show" class="dialog-overlay" @click="handleBackdropClick">
      <div class="dialog-container" @click.stop>
        <div class="dialog-content">
          <!-- Icon -->
          <div class="dialog-icon" :class="`icon-${icon}`">
            <svg v-if="icon === 'warning'" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <svg v-else-if="icon === 'danger'" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 3h18v18H3zM15 9l-6 6m0-6l6 6"/>
            </svg>
          </div>

          <!-- Title -->
          <h2 class="dialog-title">{{ title }}</h2>

          <!-- Message -->
          <p class="dialog-message">{{ message }}</p>

          <!-- Actions -->
          <div class="dialog-actions">
            <button v-if="cancelText" class="dialog-btn btn-cancel" @click="handleCancel">
              {{ cancelText }}
            </button>
            <button class="dialog-btn btn-confirm" :class="`btn-${confirmVariant}`" @click="handleConfirm">
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.dialog-container {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 28rem;
  width: 100%;
  overflow: hidden;
}

.dialog-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.dialog-icon {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;

  &.icon-warning {
    background: #fef3c7;
    color: #d97706;
  }

  &.icon-danger {
    background: #fee2e2;
    color: #dc2626;
  }

  &.icon-info {
    background: #dbeafe;
    color: #2563eb;
  }

  svg {
    width: 2rem;
    height: 2rem;
  }
}

.dialog-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.75rem 0;
}

.dialog-message {
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0 0 2rem 0;
}

.dialog-actions {
  display: flex;
  gap: 0.75rem;
  width: 100%;
  justify-content: center;
}

.dialog-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  min-width: 7rem;

  &:active {
    transform: scale(0.98);
  }

  &.btn-cancel {
    background: #f1f5f9;
    color: #475569;

    &:hover {
      background: #e2e8f0;
    }
  }

  &.btn-confirm {
    &.btn-danger {
      background: #dc2626;
      color: white;

      &:hover {
        background: #b91c1c;
      }
    }

    &.btn-primary {
      background: #2563eb;
      color: white;

      &:hover {
        background: #1d4ed8;
      }
    }
  }
}

// Transitions
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.2s ease;

  .dialog-container {
    transition: transform 0.2s ease, opacity 0.2s ease;
  }
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;

  .dialog-container {
    transform: scale(0.95);
    opacity: 0;
  }
}
</style>
