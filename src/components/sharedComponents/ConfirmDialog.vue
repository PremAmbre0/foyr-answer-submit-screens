<script setup>
import { defineProps, defineEmits, inject } from 'vue';
const appIamges = inject("appImages")
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
  confirmText: {
    type: String,
    default: 'Proceed',
  },
  cancelText: {
    type: String,
    default: 'Cancel',
  },
  themeColor: {
    type: String,
    default: '#2563EB',
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

          <div class="info-section">
            <!-- Icon -->
            <div class="dialog-icon iwpar">
              <img :src="appIamges['alert-circle.svg']" alt="Alert">
            </div>
            <div class="content">
              <!-- Title -->
              <div class="dialog-title">{{ title }}</div>

              <!-- Message -->
              <div class="dialog-message">{{ message }}</div>
            </div>
          </div>

          <!-- Actions -->
          <div class="dialog-actions">
            <button v-if="cancelText" class="dialog-btn btn-cancel" @click="handleCancel">
              {{ cancelText }}
            </button>
            <button class="dialog-btn btn-confirm" :style="{ backgroundColor: themeColor }" @click="handleConfirm">
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

  .dialog-container {
    background: white;
    border-radius: 1rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    width: 100%;
    max-width: 28.625rem;
    overflow: hidden;

    .dialog-content {
      display: flex;
      flex-direction: column;
      align-items: center;

      .info-section {
        display: flex;
        align-items: start;
        justify-content: start;
        padding: 1rem;
        gap: .75rem;

        .dialog-icon {
          width: 2.5rem;
          height: 2.5rem;
          padding: .625rem;
          border-radius: 50%;
          display: flex;
          align-items: start;
          justify-content: center;
          flex-shrink: 0;
          background: #F87171;
        }

        .content {
          display: flex;
          flex-direction: column;
          gap: .25rem;

          .dialog-title {
            color: #111827;

            font-size: 14px;
            font-weight: 700;
            line-height: 1.25rem;
          }

          .dialog-message {
            color: #6B7280;
            font-size: .875rem;
            font-weight: 400;
            line-height: 1.25rem;
            /* 142.857% */
          }
        }
      }

      .dialog-actions {
        display: flex;
        gap: 1rem;
        padding: .75rem;
        width: 100%;
        justify-content: end;
        align-items: center;
        border-top: 1px solid #E5E7EB;

        .dialog-btn {
          padding: .375rem .75rem;
          border-radius: 0.5rem;
          font-size: .75rem;
          font-weight: 700;
          line-height: 1.25rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          display: flex;
          justify-content: center;
          align-items: center;

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
            color: white;

            &:hover {
              opacity: 0.9;
            }
          }
        }
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
