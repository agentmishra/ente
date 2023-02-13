import React, { useContext } from 'react';
import { Button, styled, Typography } from '@mui/material';
import constants from 'utils/strings/constants';
import { DeduplicateContext } from 'pages/deduplicate';
import VerticallyCentered, { FlexWrapper } from './Container';
import uploadManager from 'services/upload/uploadManager';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import FolderIcon from '@mui/icons-material/FolderOutlined';

const Wrapper = styled(VerticallyCentered)`
    & > svg {
        filter: drop-shadow(3px 3px 5px rgba(45, 194, 98, 0.5));
    }
`;

export default function EmptyScreen({ openUploader }) {
    const deduplicateContext = useContext(DeduplicateContext);
    return (
        <Wrapper>
            {deduplicateContext.isOnDeduplicatePage ? (
                <div
                    style={{
                        color: '#a6a6a6',
                        fontSize: '18px',
                    }}>
                    {constants.NO_DUPLICATES_FOUND}
                </div>
            ) : (
                <>
                    <VerticallyCentered
                        sx={{
                            flex: 'none',
                            pt: 1.5,
                            pb: 1.5,
                        }}>
                        <VerticallyCentered sx={{ flex: 'none' }}>
                            {constants.WELCOME_TO_ENTE()}
                        </VerticallyCentered>
                        <Typography
                            variant="body1"
                            mt={3.5}
                            color="text.secondary">
                            {constants.WHERE_YOUR_BEST_PHOTOS_LIVE}
                        </Typography>
                    </VerticallyCentered>
                    <img
                        height={287.57}
                        src="/images/empty-state/ente_duck.png"
                        srcSet="/images/empty-state/ente_duck.png,
                                /images/empty-state/ente_duck.png"
                    />
                    <span
                        style={{
                            cursor:
                                !uploadManager.shouldAllowNewUpload() &&
                                'not-allowed',
                        }}>
                        <VerticallyCentered paddingLeft={1} paddingRight={1}>
                            <Button
                                color="accent"
                                onClick={openUploader}
                                disabled={!uploadManager.shouldAllowNewUpload()}
                                sx={{
                                    mt: 1.5,
                                    p: 1,
                                    width: 320,
                                    borderRadius: 0.5,
                                }}>
                                <FlexWrapper
                                    sx={{ gap: 1 }}
                                    justifyContent="center">
                                    <AddPhotoAlternateIcon />
                                    {constants.UPLOAD_FIRST_PHOTO}
                                </FlexWrapper>
                            </Button>
                            <Button
                                sx={{
                                    mt: 1.5,
                                    p: 1,
                                    width: 320,
                                    borderRadius: 0.5,
                                }}>
                                <FlexWrapper
                                    sx={{ gap: 1 }}
                                    justifyContent="center">
                                    <FolderIcon />
                                    {constants.IMPORT_YOUR_FOLDERS}
                                </FlexWrapper>
                            </Button>
                        </VerticallyCentered>
                        <VerticallyCentered
                            paddingTop={3}
                            paddingBottom={3}
                            sx={{ gap: 3 }}>
                            <FlexWrapper
                                sx={{ gap: 1 }}
                                justifyContent="center">
                                <a href="https://apps.apple.com/app/id1542026904">
                                    <img
                                        height={59}
                                        src="/images/download_assets/download_app_store.png"
                                        srcSet="/images/download_assets/download_app_store@2x.png,
                                /images/download_assets/download_app_store@3x.png"
                                    />
                                </a>
                                <a href="https://play.app.goo.gl/?link=https://play.google.com/store/apps/details?id=io.ente.photos">
                                    <img
                                        height={59}
                                        src="/images/download_assets/download_play_store.png"
                                        srcSet="/images/download_assets/download_play_store@2x.png,
                                /images/download_assets/download_play_store@3x.png"
                                    />
                                </a>
                            </FlexWrapper>
                            <FlexWrapper
                                sx={{ gap: 1 }}
                                justifyContent="center">
                                <a href="https://f-droid.org/packages/io.ente.photos.fdroid/">
                                    <img
                                        height={49}
                                        src="/images/download_assets/download_fdroid.png"
                                        srcSet="/images/download_assets/download_fdroid@2x.png,
                                /images/download_assets/download_fdroid@3x.png"
                                    />
                                </a>
                                <a href="https://f-droid.org/packages/io.ente.photos.fdroid/">
                                    <img
                                        height={49}
                                        src="/images/download_assets/download_github.png"
                                        srcSet="/images/download_assets/download_github@2x.png,
                                /images/download_assets/download_github@3x.png"
                                    />
                                </a>
                            </FlexWrapper>
                        </VerticallyCentered>
                    </span>
                </>
            )}
        </Wrapper>
    );
}
