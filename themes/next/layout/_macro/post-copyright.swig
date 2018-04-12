{% if theme.post_copyright.enable %}
  <hr />
  <ul class="post-copyright">
    <li class="post-copyright-author">
      <strong>{{ __('post.copyright.author') + __('symbol.colon') }}</strong>
      {{ config.author }}
    </li>
    <li class="post-copyright-link">
      <strong>{{ __('post.copyright.link') + __('symbol.colon') }}</strong>
      <a href="{{ post.permalink }}" title="{{ post.title }}">{{ post.permalink }}</a>
    </li>
    <li class="post-copyright-license">
      <strong>{{ __('post.copyright.license_title') + __('symbol.colon') }} </strong>
      {{ __('post.copyright.license_content', theme.post_copyright.license_url, theme.post_copyright.license) }}
      <a rel="license" href="{{ theme.post_copyright.license_url }}">
        <img
          alt="{{ post.copyright.license_img_alt }}" style="border-width:0;display: inline-block;"
          src="{{ theme.post_copyright.license_img_src }}"
        >
      </a>
    </li>
  </ul>
{% endif %}
