/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';
import path from 'path';

test.describe( 'Delete Media', () => {
	test.beforeAll( async ( { requestUtils } ) => {
		const files = [
			'./tests/e2e/assets/test_data_image1.jpeg',
			'./tests/e2e/assets/test_data_image2.jpeg',
			'./tests/e2e/assets/test_data_image3.jpeg'
		];
		for ( const file of files ) {
			await requestUtils.uploadMedia( file );
		}
	} );

	test.afterAll( async ( { requestUtils } ) => {
		await requestUtils.deleteAllMedia();
	} );

	test( 'delete single media', async ( { page, admin } ) => {
		await admin.visitAdminPage( 'upload.php?mode=list' );

		// Hover on the first media.
		await page
			.locator(
				'tr td.title.column-title.has-row-actions.column-primary'
			)
			.first()
			.hover();
		page.once( 'dialog', ( dialog ) => {
			dialog
				.accept()
				.catch( ( err ) =>
					console.error( 'Dialog accept failed:', err )
				);
		} );
		await page
			.locator( "tr[id^='post-'] a[aria-label^='Delete']" )
			.first()
			.click();

		await expect(
			page.locator( '#message p' ),
			'Media got deleted successfully'
		).toBeVisible();
	} );

	test( 'delete Bulk media', async ( { page, admin } ) => {
		await admin.visitAdminPage( 'upload.php?mode=list' );

		// Select the multiple media from the list.
		await page.locator( 'input[name="media[]"]' ).first().click();
		await page.locator( 'input[name="media[]"]' ).nth( 1 ).click();

		await page
			.locator( '#bulk-action-selector-top' )
			.selectOption( 'delete' );

		page.once( 'dialog', ( dialog ) => {
			dialog
				.accept()
				.catch( ( err ) =>
					console.error( 'Dialog accept failed:', err )
				);
		} );

		await page.getByRole( 'button', { name: 'Apply' } ).first().click();

		await expect(
			page.locator( '#message p' ),
			'Media got deleted successfully'
		).toBeVisible();
	} );
} );