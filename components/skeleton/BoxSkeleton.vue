<template>
  <div class="box is-fullwidth" style="width:100%;">
    <article class="media">
      <div class="media-left">
        <figure class="image is-64x64">
          <b-skeleton width="64px" height="64px"></b-skeleton>
        </figure>
      </div>
      <div class="media-content">
        <div class="content">
          <p>
            <b-skeleton width="30%"></b-skeleton>
            <br>
            <b-skeleton width="100%" height="40px"></b-skeleton>
          </p>
        </div>
      </div>
      <div class="media-right">
        <b-skeleton circle width="30px" height="30px"></b-skeleton>
      </div>
    </article>
  </div>
</template>
