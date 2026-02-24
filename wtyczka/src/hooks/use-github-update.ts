import { useEffect, useState } from "react"

const GITHUB_OWNER = "mi1ku"
const GITHUB_REPO = "antitestportal"

export function useGithubUpdate() {
    const [updateAvailable, setUpdateAvailable] = useState<string | null>(null)
    const [updateUrl, setUpdateUrl] = useState<string | null>(null)

    useEffect(() => {
        const checkUpdate = async () => {
            try {
                const response = await fetch(
                    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`
                )
                if (!response.ok) return

                const data = await response.json()
                const latestVersion = data.tag_name.replace("v", "")

                const currentVersion = chrome.runtime.getManifest().version

                if (latestVersion !== currentVersion && isNewerVersion(currentVersion, latestVersion)) {
                    setUpdateAvailable(latestVersion)

                    // Szukamy gotowego pliku zip w paczkach wydania z GitHuba
                    const asset = data.assets?.find((a: any) => a.name.endsWith(".zip"))
                    if (asset) {
                        setUpdateUrl(asset.browser_download_url)
                    } else {
                        setUpdateUrl(data.html_url)
                    }
                }
            } catch (error) {
                console.error("Błąd podczas sprawdzania aktualizacji:", error)
            }
        }

        checkUpdate()
    }, [])

    const isNewerVersion = (current: string, latest: string) => {
        const v1 = current.split(".").map(Number)
        const v2 = latest.split(".").map(Number)
        for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
            const num1 = v1[i] || 0
            const num2 = v2[i] || 0
            if (num2 > num1) return true
            if (num2 < num1) return false
        }
        return false
    }

    return { updateAvailable, updateUrl }
}
