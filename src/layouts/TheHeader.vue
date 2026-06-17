<template>
  <div class="navbar">
    <!-- Header Left -->
    <div class="navbar_left">
      <div class="narbar_left_switch_icon_wrapper" style="width: 24px; height: 24px">
        <div class="narbar_left_switch_icon icon"></div>
      </div>
      <div class="navbar_left_logo_icon"></div>
      <div class="narbar_left_title">Tiền lương</div>
    </div>

    <!-- Header Search -->
    <div class="navbar_search">
      <div class="navbar_search_icon"></div>
      <input type="text" placeholder="Tìm kiếm" class="navbar_search_input" />
    </div>

    <!-- Header Right -->
    <div class="navbar_right">
      <div class="navbar_right_options">
        <div class="navbar_right_settings_icon icon" title="Cài đặt"></div>
        <div class="navbar_right_support_icon icon" title="Hỗ trợ"></div>
        <div class="navbar_right_chat_icon icon" title="Trò chuyện"></div>
        <div class="navbar_right_noti_icon icon" title="Thông báo"></div>
        <div class="navbar_right_help_icon icon" title="Trợ giúp"></div>
        <div class="navbar_right_more_icon icon" title="Thêm"></div>
        <div class="navbar_right_account">
          <img
            class="navbar_right_account_img"
            src="https://cdn-icons-png.freepik.com/512/6858/6858504.png"
            alt="User Avatar"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
@import '../assets/css/common.css';
@import '../assets/css/icon.css';


</style>