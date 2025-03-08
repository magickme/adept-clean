<script>
	let { membershipInfo, logoUrl, linkUrl, isDarkMode } = $props();
</script>

<div class="bg-kohl p-8">
	<div class="bg-kohl/80 text-ivory p-4 rounded-lg shadow-md max-w-3xl mx-auto ring-1 ring-ivory/10">
		<div class="flex items-center space-x-4">
			<a href={linkUrl} aria-label="Membership link">
				<div class="flex-shrink-0">
					<img src={logoUrl} alt="Logo" class="h-8 w-8 text-cerulean" width="32" height="32" />
				</div>
			</a>
			<a href={linkUrl} aria-label="Membership link">
				<div class="flex-1 text-sm font-sourceSans">
					<p>{membershipInfo}</p>
				</div>
			</a>
		</div>
	</div>
</div>
